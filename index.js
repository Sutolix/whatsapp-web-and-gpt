import qrcode from 'qrcode-terminal'
import pkg from 'whatsapp-web.js'
import OpenAI from "openai"

const openai = new OpenAI()
const { Client, LocalAuth } = pkg
const client = new Client({
    authStrategy: new LocalAuth()
})

async function generateAnswer(prompt) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: `${prompt}` }],
    model: "gpt-3.5-turbo",
  });
  return completion.choices[0].message.content
}

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true })
});

client.on('ready', () => {
    console.log('Client is ready!')
});

client.on('message_create', async (message) => {
  console.log(message)
	if (message.body.startsWith('@gpt')) {
    await message.reply('Aguarde enquanto a resposta é gerada...')

    const prompt = message.body.replace('@gpt', '')
    const answer = await generateAnswer(prompt)
		await message.reply(answer)
	}
});

client.initialize()
