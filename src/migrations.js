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
    }
  ]
}
