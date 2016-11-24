ConversationType = GraphQL::ObjectType.define do
  name 'Conversation'
  description 'Fetch conversation associated fields'
  interfaces [GraphQL::Relay::Node.interface]
  global_id_field :id

  field :subject, types.String, 'Subject of this conversation'
  field :created_at, types.String, 'When this conversation was created'
  field :last_message, MessageType, 'Last message of this conversation'
  field :count_messages, types.String, 'Total messages count'

  field :is_trashed, types.Boolean, 'Is conversation trashed?' do
    resolve ->(obj, _args, _ctx) do
      obj.is_trashed?(ctx[:current_user])
    end
  end

  field :is_unread, types.Boolean, 'Is conversation unread?' do
    resolve ->(obj, _args, _ctx) do
      obj.is_unread?(ctx[:current_user])
    end
  end

  connection :receipts, ReceiptType.connection_type do
    description 'Receipt connection to fetch paginated receipts.'
    resolve ->(obj, _args, ctx) { obj.receipts_for(ctx[:current_user]) }
  end

  connection :participants, ParticipantType.connection_type do
    description 'Message connection to fetch paginated messages.'
    resolve ->(obj, _args, ctx) do
      obj.participants.select { |p| p != ctx[:current_user] }
    end
  end
end
