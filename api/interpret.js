const { OpenAI } = require('openai');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const upload = multer({ dest: '/tmp' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        upload.single('file')(req, res, async (err) => {
            if (err || !req.file) {
                return res.status(400).json({ message: "Błąd przy przesyłaniu pliku" });
            }

            try {
                const filePath = req.file.path;
                const fileData = fs.readFileSync(filePath);
                const pdfText = await pdfParse(fileData);

                const promptText = `Na podstawie poniższego pliku genetycznego wykonaj interpretację:

${pdfText.text}`;

                const completion = await openai.chat.completions.create({
                    model: 'gpt-4',
                    messages: [
                        { role: 'system', content: 'Jesteś ekspertem w interpretacji genetyki.' },
                        { role: 'user', content: promptText },
                    ],
                });

                const chatResponse = completion.choices[0].message.content;

                res.json({ message: chatResponse });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Błąd podczas interpretacji pliku" });
            }
        });
    } else {
        res.status(405).json({ message: 'Metoda nieobsługiwana' });
    }
};
