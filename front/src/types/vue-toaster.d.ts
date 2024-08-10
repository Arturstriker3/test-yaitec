declare module '@meforma/vue-toaster' {
    import { PluginFunction } from 'vue';
  
    interface ToasterOptions {
      position?: string;
      duration?: number;
    }
  
    interface Toaster {
      show(message: string, options?: ToasterOptions): void;
      success(message: string, options?: ToasterOptions): void;
      error(message: string, options?: ToasterOptions): void;
      info(message: string, options?: ToasterOptions): void;
      warning(message: string, options?: ToasterOptions): void;
    }
  
    export function createToaster(options?: ToasterOptions): Toaster;
    const VueToaster: PluginFunction<ToasterOptions>;
    export default VueToaster;
  }