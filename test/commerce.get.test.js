/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { codes } = require('../src/SDKErrors')

/* global createSdkClient */ // for linter

test('getCommerceCommandExecution - error - failure to find correct environment', async () => {
  expect.assertions(2)

  const sdkClient = await createSdkClient()
  const result = sdkClient.listAvailableLogOptions('4', '9')

  await expect(result instanceof Promise).toBeTruthy()
  await expect(result).rejects.toEqual(
    new codes.ERROR_FIND_ENVIRONMENT({ messageValues: ['9', '4'] }),
  )
})

test('getCommerceCommandExecution - error - failure to retrieve environments', async () => {
  expect.assertions(2)

  const sdkClient = await createSdkClient()
  const result = sdkClient.listAvailableLogOptions('6', '7', '8')

  await expect(result instanceof Promise).toBeTruthy()
  await expect(result).rejects.toEqual(
    new codes.ERROR_RETRIEVE_ENVIRONMENTS({ messageValues: 'https://cloudmanager.adobe.io/api/program/6/environments (404 Not Found)' }),
  )
})

test('getCommerceCommandExecution - success', async () => {
  expect.assertions(2)

  const sdkClient = await createSdkClient()
  const result = sdkClient.getCommerceCommandExecution('4', '10', '1')

  await expect(result instanceof Promise).toBeTruthy()
  await expect(result).resolves.toMatchObject({
    id: 1,
    status: 'RUNNNG', // PENDING, RUNNING, COMPLETED, FAILED
    type: 'bin/magento', // bin/magento, bin/ece-tools
    command: 'test command to be executed',
    message: 'One line message on the progress of command',
    options: ['Optional', 'inputs provided part of the command'],
    startedAt: 'timestamp UTC',
    completedAt: 'timestamp utc',
    startedBy: 'test runner',
    _links: {
      self: {
        href: '/api/program/4/environment/10/runtime/commerce/command-execution/1',
      },
      'http://ns.adobe.com/adobecloud/rel/program': {
        href: '/api/program/4',
      },
      'http://ns.adobe.com/adobecloud/rel/environments': {
        href: '/api/program/4/environments',
      },
      'http://ns.adobe.com/adobecloud/rel/commerceCommandExecutions': {
        href: '/api/program/4/environment/10/runtime/commerce/command-executions',
      },
    },
  })
})
