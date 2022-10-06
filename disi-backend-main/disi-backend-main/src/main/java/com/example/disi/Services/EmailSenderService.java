package com.example.disi.Services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.util.Properties;

@Service
@RequiredArgsConstructor
public class EmailSenderService {

    public String sendMail(String toEmail, String subject, String message, boolean attachement, MimeMultipart multipart) {
        String fromEmail = "dcalugar70@gmail.com";
        String password = "vsyehaywtzgdbhei";

        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.port", "587");

        Session session = Session.getInstance(properties, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, password);
            }
        });

        MimeMessage mimeMessage = new MimeMessage(session);
        try {
            mimeMessage.setFrom(new InternetAddress(fromEmail));
            mimeMessage.addRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));
            mimeMessage.setSubject(subject);

            if(attachement==true){
                mimeMessage.setContent(multipart);
            }
            else{
                mimeMessage.setText(message);
            }

            Transport.send(mimeMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Emailu sent successfully";
    }

    public String codeGeneration() {
        int code = (int) (Math.random() * (9999 - 1000 + 1) + 1000);
        return String.valueOf(code);
    }

}
