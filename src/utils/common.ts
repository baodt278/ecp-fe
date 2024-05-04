import {Badge} from "@/components/ui/badge";

export function translateType(input: string): any {
    switch (input) {
        // contractType
        case "FAMILY":
            return "Sinh hoạt";
        case "BUSINESS":
            return "Kinh doanh";
        case "PRODUCE":
            return "Sản xuất";
        case "PUBLIC_GOV":
            return "Hành chính công";
        case "EDU_MEDIC":
            return "Y tế - Giáo dục";
        case "COMPLEX":
            return "Tổ hợp";

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
            return "Kiến nghị";
        case "QUESTION":
            return "Hỏi đáp";
        case "PAYMENT":
            return "Thanh toán";

        // roles
        case "ADMIN":
            return "Quản trị viên";
        case "STAFF":
            return "Nhân viên";
        case "CLIENT":
            return "Khách hàng";
        case "MANAGER":
            return "Quản lý";

        // tag
        case "LOW":
            return "Giờ thấp điểm";
        case "NORMAL":
            return "Giờ bình thường";
        case "HIGH":
            return "Giờ cao điểm";
        case "LEVEL1":
            return "Bậc 1";
        case "LEVEL2":
            return "Bậc 2";
        case "LEVEL3":
            return "Bậc 3";
        case "LEVEL4":
            return "Bậc 4";
        case "LEVEL5":
            return "Bậc 5";
        case "LEVEL6":
            return "Bậc 6";

        default:
            return "Không xác định";
    }
}

export function formatNumber(number: number): string {
    if (!isFinite(number)) {
        return "0";
    }

    const integerPart = Math.floor(number);
    return integerPart
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function convertString(input: string): string {
    const str = input.split("|");
    const result: string[] = [];

    if (str.length === 6) {
        if (str[0].trim() !== "") {
            result.push("Tên hợp đồng: " + str[0].trim());
        }
        if (str[1].trim() !== "") {
            result.push("Địa chỉ: " + str[1].trim());
        }
        if (str[2].trim() !== "") {
            result.push("Số hộ: " + str[2].trim());
        }
        if (str[3].trim() !== "") {
            result.push("Loại hợp đồng: " + translateType(str[3].trim()));
        }
        if (str[5].trim() !== "") {
            result.push("Điện áp: " + translateType(str[5].trim()));
        }
        if (str[4].trim() !== "") {
            result.push("Tình trạng: " + translateType(str[4].trim()));
        }
        input = result.join('\n');
    }

    return input
}

export const convertToShortContent = (content: string, length: number): string => {
    if (content.length <= length) {
        return content;
    }

    return content.slice(0, length) + "...";
}

export const convertContentByLine = (content: string): string => {
    return content.replace(/\n/g, "<br/>");
}