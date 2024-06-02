import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.

function failToSetCookie()
{
  return ipcRenderer.invoke('failToSetCookie')
}

if (process.contextIsolated)
{
  try
  {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('failToSetCookie', failToSetCookie);
  } catch (error)
  {
    console.error(error)
  }
} else
{
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.failToSetCookie = failToSetCookie;
}
