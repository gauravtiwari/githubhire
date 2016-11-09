module HttpClient
  extend ActiveSupport::Concern

  private

  def initialize_agent(uri)
    Sawyer::Agent.new(uri, faraday: client) do |http|
      http.headers['content-type'] = 'application/json'
    end
  end

  def client
    Faraday.new do |builder|
      builder.request  :url_encoded
      builder.response :logger unless Rails.env.test?
      builder.request :retry
      builder.adapter Faraday.default_adapter
    end
  end
end