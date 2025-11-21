import config from "config";

console.log("=== Configuration Diagnostic ===");

try {
  const port = config.get<number>("port");
  console.log(`✅ Port: ${port}`);

  const dbConfig = config.get<object>("database");
  console.log(`✅ Database config: ${JSON.stringify(dbConfig, null, 2)}`);

  const accessTokenPrivateKey = config.get<string>("accessTokenPrivateKey");
  console.log(`✅ Access token private key: ${accessTokenPrivateKey ? 'Present' : 'Missing'}`);

  const accessTokenPublicKey = config.get<string>("accessTokenPublicKey");
  console.log(`✅ Access token public key: ${accessTokenPublicKey ? 'Present' : 'Missing'}`);

  const refreshTokenPrivateKey = config.get<string>("refreshTokenPrivateKey");
  console.log(`✅ Refresh token private key: ${refreshTokenPrivateKey ? 'Present' : 'Missing'}`);

  const refreshTokenPublicKey = config.get<string>("refreshTokenPublicKey");
  console.log(`✅ Refresh token public key: ${refreshTokenPublicKey ? 'Present' : 'Missing'}`);

  console.log("\n✅ All configuration values are accessible");

} catch (error) {
  console.error("❌ Configuration error:", error);
}