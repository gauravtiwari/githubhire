module Employers
  ToggleFavourite = GraphQL::Relay::Mutation.define do
    name 'ToggleFavourite'
    description 'Toggles a developer profile favourite'

    # Define input and return field
    input_field :id, !types.ID
    return_field :developer, DeveloperType

    # Resolve block to toggle a profile favourite
    resolve(ToggleFavouriteResolver)
  end
end