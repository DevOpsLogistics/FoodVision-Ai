import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.config import settings

logger = logging.getLogger(__name__)


def send_new_password_email(to_email: str, new_password: str) -> None:
    subject = "FoodVision AI — Mật khẩu của bạn"
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h2 style="color:#b82c2a">FoodVision AI</h2>
      <p>Bạn vừa yêu cầu lấy lại mật khẩu.</p>
      <p>Mật khẩu mới của bạn:</p>
      <p style="font-size:20px;font-weight:bold;background:#f5f5f5;padding:12px 16px;border-radius:8px;letter-spacing:1px">
        {new_password}
      </p>
      <p style="font-size:13px;color:#666">Đăng nhập và đổi mật khẩu trong phần cài đặt nếu cần.</p>
      <p style="font-size:13px;color:#666">Nếu không phải bạn, hãy đổi mật khẩu ngay.</p>
    </div>
    """
    text = f"Mật khẩu mới FoodVision AI: {new_password}\nĐăng nhập tại {settings.frontend_url}/login"

    if not settings.smtp_user or not settings.smtp_password:
        logger.warning("[Email] SMTP chưa cấu hình. MK mới cho %s: %s", to_email, new_password)
        print(f"\n[FoodVision] SMTP chưa cấu hình — MK mới cho {to_email}: {new_password}\n")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.smtp_from or settings.smtp_user
    msg["To"] = to_email
    msg.attach(MIMEText(text, "plain", "utf-8"))
    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=30) as server:
        server.starttls()
        server.login(settings.smtp_user, settings.smtp_password)
        server.sendmail(msg["From"], [to_email], msg.as_string())
