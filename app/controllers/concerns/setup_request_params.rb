module SetupRequestParams
  extend ActiveSupport::Concern

  included do
    before_action :request_params
  end

  # Setup request param
  def request_params
    # For home route this will be empty so setup popular params
    if member_params.empty? || member_params.except(:page).empty?
      popular = {
        followers: ">=1000",
        repos: ">=20"
      }
      return popular unless member_params["page"].present?
      # Format page param and add it to request params
      popular.merge!({page: member_params["page"], q: member_params["q"]})
    else
      # For everything else just use formatted permitted params
      keys = {}
      member_params.each{|key, value|
        keys[:"#{key}"] = value
      }
      keys
    end
  end

  # Generate a cache key based on request params
  def cache_key
    keys = request_params.map{
      |key, value| "#{key}:#{value}" unless value.nil?
    }
    # Join keys
    keys.join
  end

  private
    # Whitelist the params for our controller
    def member_params
      params.permit(:q, :keyword, :followers, :repos, :location, :created, :language, :page)
    end

end