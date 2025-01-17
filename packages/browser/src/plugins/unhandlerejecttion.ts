import { BrowserBreadcrumbTypes, BrowserEventTypes, ErrorTypes } from '@mitojs/shared'
import {
  extractErrorStack,
  getBreadcrumbCategoryInBrowser,
  getLocationHref,
  getTimestamp,
  isError,
  on,
  Severity,
  unknownToString,
  _global
} from '@mitojs/utils'
import { BasePluginType, HttpTransformedType, ReportDataType } from '@mitojs/types'
import { BrowserClient } from '../browserClient'
import { httpTransformedDataConsumer } from './xhr'

const name = BrowserEventTypes.UNHANDLEDREJECTION
const unhandlerejectionPlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name,
  monitor(notify) {
    on(_global, name, function (ev: PromiseRejectionEvent) {
      // ev.preventDefault() 阻止默认行为后，控制台就不会再报红色错误
      notify(name, ev)
    })
  },
  transform(collectedData: PromiseRejectionEvent) {
    let data: ReportDataType = {
      type: ErrorTypes.PROMISE,
      message: unknownToString(collectedData.reason),
      url: getLocationHref(),
      name: collectedData.type,
      time: getTimestamp(),
      level: Severity.Low
    }
    if (isError(collectedData.reason)) {
      data = {
        ...data,
        ...extractErrorStack(collectedData.reason, Severity.Low)
      }
    }
    return data
  },
  consumer(transformedData: HttpTransformedType) {
    const breadcrumbStack = this.breadcrumb.push({
      type: BrowserBreadcrumbTypes.UNHANDLEDREJECTION,
      category: getBreadcrumbCategoryInBrowser(BrowserBreadcrumbTypes.UNHANDLEDREJECTION),
      data: transformedData,
      level: Severity.Error
    })
    this.transport.send(transformedData, breadcrumbStack)
  }
}

export default unhandlerejectionPlugin
