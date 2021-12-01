export default (fn: (...params: any) => any, timeout = 500) => {
  let timer: number

  return (...params: any) => {
    clearTimeout(timer)
    timer = window.setTimeout(() => fn(...params), timeout)
  }
}
