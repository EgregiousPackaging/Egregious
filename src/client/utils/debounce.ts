export default (fn: Function, timeout: number = 500) => {
  let timer: number

  return (...params: any) => {
    clearTimeout(timer)
    timer = window.setTimeout(() => fn(...params), timeout)
  }
}
