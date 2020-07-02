export const orderStatus = {
  waiting: "Đang chờ",
  accepted: "Đã chấp nhận",
  fixing: "Đang sửa",
  done: "Đã hoàn thành",
  canceled: "Đã huỷ",
}

export const orderUncompletedLabels = [orderStatus.waiting, orderStatus.accepted, orderStatus.fixing, orderStatus.done]

export const orderCanceledLabels = [orderStatus.waiting, orderStatus.canceled]