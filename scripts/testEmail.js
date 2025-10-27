const nodemailer = require('nodemailer');
require('dotenv').config();

const testEmail = async () => {
  console.log('📧 Testing Email Configuration...\n');
  
  // Check if required environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('❌ Missing email configuration:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST || 'smtp.gmail.com');
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT || 587);
    return false;
  }

  // Fix the email address if it has extra dot
  const emailUser = process.env.EMAIL_USER.replace('@.', '@');
  console.log('📋 Email Configuration:');
  console.log('──────────────────────────────');
  console.log('Email User:', emailUser);
  console.log('Email Host:', process.env.EMAIL_HOST || 'smtp.gmail.com');
  console.log('Email Port:', process.env.EMAIL_PORT || 587);
  console.log('──────────────────────────────\n');

  try {
    // Create transporter 
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection configuration
    console.log('🔗 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    // Send test email
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: `"Warm Delights Bakery" <${emailUser}>`,
      to: emailUser, // Send to yourself
      subject: '✅ Warm Delights - Email Test Successful!',
      text: `This is a test email from your Warm Delights bakery server.

Server: ${process.env.EMAIL_HOST || 'smtp.gmail.com'}
Port: ${process.env.EMAIL_PORT || 587}
Email: ${emailUser}

If you received this email, your email configuration is working perfectly! 🎉

Best regards,
Warm Delights Bakery Team`,

      html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF7B54 0%, #FFB26B 100%); padding: 20px; color: white; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .success { color: #28a745; font-weight: bold; }
        .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Email Test Successful!</h1>
            <p>Warm Delights Bakery</p>
        </div>
        <div class="content">
            <p>Hello!</p>
            <p>This is a test email from your <strong>Warm Delights</strong> bakery server.</p>
            
            <div class="details">
                <h3>📧 Configuration Details:</h3>
                <p><strong>Server:</strong> ${process.env.EMAIL_HOST || 'smtp.gmail.com'}</p>
                <p><strong>Port:</strong> ${process.env.EMAIL_PORT || 587}</p>
                <p><strong>Email:</strong> ${emailUser}</p>
            </div>

            <p class="success">✅ Your email configuration is working perfectly!</p>
            
            <p>You can now send order confirmations, custom order requests, and notifications to your customers.</p>
            
            <p>Best regards,<br>
            <strong>Warm Delights Bakery Team</strong></p>
        </div>
    </div>
</body>
</html>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('📨 Message ID:', info.messageId);
    console.log('👤 Recipient:', emailUser);
    console.log('\n🎉 Email configuration is working perfectly!');
    console.log('You can now send order confirmations and notifications to your customers.');

    return true;

  } catch (error) {
    console.log('\n❌ Email test failed:');
    console.log('Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔒 Authentication failed. Possible reasons:');
      console.log('1. Did you enable 2-Factor Authentication on Gmail?');
      console.log('2. Did you use App Password (not regular password)?');
      console.log('3. Is the app password correct?');
      console.log('4. Check if there are any typos in email or password');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n🌐 Connection failed. Possible reasons:');
      console.log('1. Check your internet connection');
      console.log('2. Firewall blocking port 587');
      console.log('3. Wrong SMTP host or port');
    }
    
    return false;
  }
};

// Run the test
testEmail()
  .then(success => {
    if (success) {
      console.log('\n📧 Check your inbox for the test email!');
      console.log('If you don\'t see it, check your spam folder.');
    } else {
      console.log('\n❌ Please fix the issues above and try again.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });