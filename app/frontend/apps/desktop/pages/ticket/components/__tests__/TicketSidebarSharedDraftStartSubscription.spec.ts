// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

import { renderComponent } from '#tests/support/components/index.ts'
import {
  mockGraphQLApi,
  mockGraphQLSubscription,
} from '#tests/support/mock-graphql-api.ts'
import { waitForNextTick } from '#tests/support/utils.ts'

import { TicketSharedDraftStartListDocument } from '#shared/entities/ticket-shared-draft-start/graphql/queries/ticketSharedDraftStartList.api.ts'
import { TicketSharedDraftStartUpdateByGroupDocument } from '#shared/entities/ticket-shared-draft-start/graphql/subscriptions/ticketSharedDraftStartUpdateByGroup.api.ts'
import { GraphQLErrorTypes } from '#shared/types/error.ts'

import sharedDraftStartSidebarPlugin from '../TicketSidebar/plugins/shared-draft-start.ts'
import TicketSidebarSharedDraftStartButton from '../TicketSidebar/TicketSidebarSharedDraftStartButton.vue'
import { TicketSidebarScreenType } from '../types.ts'

// NB: We have to run this test example inside its own test, since it does not play nicely with automocker.
//   The issue stems from the fact that automocker does not support triggering hard errors in queries.
//   Therefore, we manually register the subscription and fail the query with a protocol error,
//   in order to cover the expected behavior.
describe('TicketSidebarSharedDraftStartButton.vue', () => {
  it('hides sidebar when shared draft feature is inactive', async () => {
    mockGraphQLSubscription(TicketSharedDraftStartUpdateByGroupDocument)

    mockGraphQLApi(TicketSharedDraftStartListDocument).willFailWithError([
      {
        message: 'Shared drafts are not activated for the selected group',
        extensions: {
          type: GraphQLErrorTypes.UnknownError,
        },
      },
    ])

    const wrapper = renderComponent(TicketSidebarSharedDraftStartButton, {
      props: {
        sidebar: 'shared-draft-start',
        sidebarPlugin: sharedDraftStartSidebarPlugin,
        selected: true,
        context: {
          screenType: TicketSidebarScreenType.TicketCreate,
          formValues: {
            group_id: 1,
          },
        },
      },
    })

    await waitForNextTick() // wait for query to kick in
    await waitForNextTick() // wait for error callback to kick in

    expect(wrapper.emitted('hide')).toHaveLength(1)
  })
})