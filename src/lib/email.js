import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email, resetToken) {
  const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/resetar-senha?token=${resetToken}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Easynizze <onboarding@resend.dev>',
      to: [email],
      subject: 'Recuperação de Senha - Easynizze',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recuperação de Senha - Easynizze</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .title {
              font-size: 24px;
              color: #333;
              margin-bottom: 10px;
            }
            .subtitle {
              color: #666;
              font-size: 16px;
            }
            .button {
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 30px 0;
              transition: background-color 0.3s;
            }
            .button:hover {
              background-color: #1d4ed8;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            .warning {
              background-color: #fef3c7;
              border: 1px solid #f59e0b;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .code {
              background-color: #f3f4f6;
              padding: 10px;
              border-radius: 5px;
              font-family: monospace;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Easynizze</div>
              <h1 class="title">Recuperação de Senha</h1>
              <p class="subtitle">Recebemos uma solicitação para resetar sua senha</p>
            </div>

            <p>Olá,</p>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta Easynizze. Se você não fez esta solicitação, pode ignorar este email.</p>

            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Resetar Minha Senha</a>
            </div>

            <div class="warning">
              <strong>Importante:</strong> Este link expira em <strong>1 hora</strong>. Após esse período, você precisará solicitar uma nova recuperação de senha.
            </div>

            <p>Se o botão acima não funcionar, copie e cole este link no seu navegador:</p>
            <div class="code">${resetLink}</div>

            <div class="footer">
              <p>Este é um email automático. Por favor, não responda.</p>
              <p>&copy; 2026 Easynizze. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro no serviço de email:', error);
    return { success: false, error: 'Erro ao enviar email' };
  }
}
