export const orderStatus = {
  waiting: "Đang chờ",
  accepted: "Đã chấp nhận",
  rejected: "Đã bị từ chối",
  done: "Đã hoàn thành",
  canceled: "Đã huỷ",
}

export const orderUncompletedLabels = [orderStatus.waiting, orderStatus.accepted, orderStatus.done]

export const orderCanceledLabels = [orderStatus.waiting, orderStatus.canceled]

export const orderRejectedLabels = [orderStatus.waiting, orderStatus.rejected]