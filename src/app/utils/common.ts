export function translateType(input: string): string {
  switch (input) {
    // contractType
    case "FAMILY":
      return "Hộ gia đình";
    case "BUSINESS":
      return "Kinh doanh";
    case "PRODUCE":
      return "Sản xuất";
    case "PUBLIC_GOV":
      return "Hành chính công";
    case "EDU_MEDIC":
      return "Y tế - Giáo dục";
    case "COMPLEX":
      return "Trả trước";

    // contractStatus
    case "ACTIVE":
      return "Đang hoạt động";
    case "INACTIVE":
      return "Ngưng hoạt động";
    case "CANCELED":
      return "Đã hủy";

    // Volt
    case "BELOW_6KV":
      return "Dưới 6KV";
    case "FROM_6KV_TO_22KV":
      return "Từ 6KV đến 22KV";
    case "FROM_22KV_TO_110KV":
      return "Từ 22KV đến 110KV";
    case "ABOVE_110KV":
      return "Trên 110KV";

    // billStatus
    case "PAID":
      return "Đã thanh toán";
    case "UNPAID":
      return "Chưa thanh toán";
    case "EXPIRED":
      return "Quá hạn";
    
    //requestStatus
    case "PENDING":
      return "Đang chờ";
    case "REVIEWED":
      return "Đã xét duyệt";  
    case "APPROVED":
      return "Đã chấp nhận";
    case "REJECTED":
      return "Đã từ chối";  
      
    //requestType
    case "CLIENT_VERIFY":
      return "Xác minh thông tin";
    case "CONTRACT_NEW":
      return "Tạo hợp đồng mới";
    case "CONTRACT_CHANGE":
      return "Thay đổi hợp đồng";
    case "CONTRACT_STATUS":
      return "Thay đổi trạng thái hợp đồng";
    case "CONTRACT_ERROR":
      return "Báo lỗi";
    case "EMERGENCY":
      return "Khẩn cấp";
    case "ADVICE":
      return "Tư vấn";
    case "QUESTION":
      return "Hỏi đáp";
      
      
    default:
      return "Không xác định";
  }
}

export function formatNumber(number: number): string {
  if (isNaN(number)) {
    return "NaN";
  }
  const integerPart = Math.floor(number);
  const formattedInteger = integerPart
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return formattedInteger;
}
