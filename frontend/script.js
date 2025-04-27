document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-input');
    const resultDiv = document.getElementById('result');
    const submitButton = document.getElementById('submit-button');

    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const file = fileInput.files[0];
        if (!file) {
            alert('Wybierz plik!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        resultDiv.innerText = '⌛ interpretuję twój plik...';
        submitButton.disabled = true;

        try {
            const response = await fetch('/api/interpret', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Błąd serwera');
            }

            const data = await response.json();
            resultDiv.innerText = data.message;
        } catch (error) {
            console.error(error);
            resultDiv.innerText = '❌ coś poszło nie tak, spróbuj ponownie później.';
        } finally {
            submitButton.disabled = false;
        }
    });
});
