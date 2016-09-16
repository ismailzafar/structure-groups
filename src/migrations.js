export default {
  tables: [
    {
      action: 'create',
      table: 'groups',
      indexes: [
        'organizationId'
      ]
    },
    {
      action: 'create',
      table: 'link_groups_users',
      indexes: [
        'groupId',
        'userId'
      ],
      compoundIndexes: [
        {
          name: 'link_group_user',
          indexes: ['groupId', 'userId']
        }
      ]
    },
    {
      action: 'create',
      table: 'link_organizations_groups',
      indexes: [
        'organizationId',
        'groupId'
      ],
      compoundIndexes: [
        {
          name: 'link_organization_group',
          indexes: ['organizationId', 'groupId']
        }
      ]
    },
  ]
}
