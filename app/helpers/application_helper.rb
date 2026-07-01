module ApplicationHelper
  def flash_class(type)
    case type
    when "notice" then "alert-success"
    when "alert"  then "alert-danger"
    else "alert-info"
    end
  end

  def qr_code_svg(url)
    qrcode = RQRCode::QRCode.new(url)
    svg = qrcode.as_svg(
      module_size: 4,
      standalone: true,
      use_path: true,
      color: "333"
    )
    svg.html_safe
  end
end
