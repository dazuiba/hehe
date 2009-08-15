# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_twork2_session',
  :secret      => '1e8c8fa7b77d468728147f712cc154aa0c41ed69fbca44b46d70fd1d9ece035621850b0b0e6fa5c67a9b4b98b7bac2864d4d9affefd0ede7d4557b43b0539c4d'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
