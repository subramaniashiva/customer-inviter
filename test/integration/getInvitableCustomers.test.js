const nock = require('nock');
const { URL } = require('url');
const path = require('path');
const { open } = require('fs/promises');

const {
  server,
  constants,
} = require('../../src/container');
const { expect } = require('chai');

describe('getInvitableCustomers', () => {
  const { stub, reset: resetSandbox, restore } = sinon.createSandbox();
  const customerDataUrl = new URL(constants.CUSTOMER_DATA_URL);
  const customerDataUrlOrigin = customerDataUrl.origin;
  const customerDataUrlPath = customerDataUrl.pathname;

  before(() => {
    process.env.NODE_ENV = 'test';
  });

  after(() => {
    resetSandbox();
  });

  describe('when the customer data url is not reachable', () => {
    let customerDataUrlNock;

    before(() => {
      stub(process, 'exit');
      customerDataUrlNock = nock(customerDataUrlOrigin)
        .get(customerDataUrlPath)
        .reply(500, {
          error: 'Site not reachable',
        });
    });

    after(restore);

    it('throws an error and exits', async () => {
      await server.start();

      expect(customerDataUrlNock.isDone()).to.be.true;
      return expect(process.exit).to.have.been.calledOnceWith(1);
    });
  });

  describe('when the customer data url is reachable', () => {
    describe('when there is no access to the resource', () => {
      let customerDataUrlNock;

      before(() => {
        stub(process, 'exit');
        customerDataUrlNock = nock(customerDataUrlOrigin)
          .get(customerDataUrlPath)
          .reply(403, {
            error: 'Not authorized to access this resource',
          });
      });

      after(restore);

      it('throws an error and exits', async () => {
        await server.start();

        expect(customerDataUrlNock.isDone()).to.be.true;
        return expect(process.exit).to.have.been.calledOnceWith(1);
      });
    });

    describe('when the resource can be accessed', () => {
      describe('when the file is empty', () => {
        let customerDataUrlNock;

        before(() => {
          stub(process, 'exit');
          customerDataUrlNock = nock(customerDataUrlOrigin)
            .get(customerDataUrlPath)
            .replyWithFile(200, `${__dirname}/test-data/empty.txt`);
        });

        after(restore);

        it('does not throw an error', async () => {
          await server.start();

          expect(process.exit).not.to.have.been.calledWith(1);
          return expect(customerDataUrlNock.isDone()).to.be.true;
        });
      });

      describe('when the file is not empty', () => {
        describe('when all the rows are valid', () => {
          let customerDataUrlNock;
          before(() => {
            stub(process, 'exit');
            customerDataUrlNock = nock(customerDataUrlOrigin)
              .get(customerDataUrlPath)
              .replyWithFile(200, `${__dirname}/test-data/all-rows-valid.txt`);
          });

          after(restore);

          it('writes the customers living within 100 kms to a file', async () => {
            await server.start();

            const actualOutput = await open(path.join(__dirname, '../../.test-output/inviteList100Kms.txt'), 'r');
            const expectedOutput = await open(`${__dirname}/test-data/all-rows-valid-expected.txt`, 'r');

            const actualBuffer = await actualOutput.readFile();
            const expectedBuffer = await expectedOutput.readFile();

            expect(customerDataUrlNock.isDone()).to.be.true;
            return expect(actualBuffer.equals(expectedBuffer)).to.be.true;
          });
        });

        describe('when few rows are invalid', () => {
          let customerDataUrlNock;
          before(() => {
            stub(process, 'exit');
            customerDataUrlNock = nock(customerDataUrlOrigin)
              .get(customerDataUrlPath)
              .replyWithFile(200, `${__dirname}/test-data/few-invalid-rows.txt`);
          });

          after(restore);

          it('ignores the invalid rows while writing selected customers to a file', async () => {
            await server.start();

            const actualOutput = await open(path.join(__dirname, '../../.test-output/inviteList100Kms.txt'), 'r');
            const expectedOutput = await open(`${__dirname}/test-data/few-invalid-rows-expected.txt`, 'r');

            const actualBuffer = await actualOutput.readFile();
            const expectedBuffer = await expectedOutput.readFile();

            expect(customerDataUrlNock.isDone()).to.be.true;
            return expect(actualBuffer.equals(expectedBuffer)).to.be.true;
          });
        });
      });
    });
  });
});
