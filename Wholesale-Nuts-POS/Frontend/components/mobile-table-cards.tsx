"use client"

import { useLayoutEffect } from "react"

function applyMobileCardLabels(table: HTMLTableElement) {
  const headers = Array.from(table.querySelectorAll("thead th")).map((th) =>
    (th.textContent || "").replace(/\s+/g, " ").trim(),
  )

  table.querySelectorAll("tbody tr, tfoot tr").forEach((tr) => {
    const cells = Array.from(tr.querySelectorAll(":scope > td")) as HTMLTableCellElement[]
    let headerIndex = 0
    cells.forEach((td) => {
      const span = Math.max(1, td.colSpan || 1)
      if (span > 1) {
        td.removeAttribute("data-label")
        headerIndex += span
        return
      }
      const label = headers[headerIndex] || ""
      if (label) td.setAttribute("data-label", label)
      headerIndex += span
    })
  })
}

function shouldEnhanceTable(table: HTMLTableElement) {
  if (table.closest(".rdp, .rdp-root, [data-radix-popper-content-wrapper], .pos-keep-table")) {
    return false
  }
  if (table.querySelector("thead tr.flex, .rdp-head_row, .rdp-row")) {
    return false
  }
  return Boolean(table.tHead && table.tHead.querySelector("th"))
}

export function enhanceTablesForMobile(root: ParentNode = document) {
  root.querySelectorAll("table").forEach((node) => {
    const table = node as HTMLTableElement
    if (!shouldEnhanceTable(table)) return
    table.classList.add("pos-responsive-table")
    const wrap = table.parentElement
    if (wrap && wrap.classList.contains("overflow-x-auto")) {
      wrap.classList.add("pos-table-scroll")
    }
    applyMobileCardLabels(table)
  })
}

export function MobileTableCards() {
  useLayoutEffect(() => {
    let frame = 0
    const run = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => enhanceTablesForMobile())
    }

    run()
    const observer = new MutationObserver(run)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return null
}
