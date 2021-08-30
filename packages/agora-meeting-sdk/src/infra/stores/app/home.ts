import { GlobalStorage } from '../../storage';
import { LaunchConfig } from "@/infra/api";

export class HomeStore {
  launchOption!: Omit<LaunchConfig, 'listener'>
  launchKey: string

  constructor(context: any) {
    this.launchKey = `home_store_demo_launch_key`
    this.launchOption = GlobalStorage.read(this.launchKey) || {}
  }

  setLaunchConfig(payload:any) {
    this.launchOption = payload
    GlobalStorage.save(this.launchKey, this.launchOption)
  }


}