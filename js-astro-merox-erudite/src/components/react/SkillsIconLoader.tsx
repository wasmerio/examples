/**
 * Optimized icon loader for Skills component
 * This helps with tree-shaking by importing icons only when needed
 */
import { type IconType } from 'react-icons'
import { FaQuestionCircle } from 'react-icons/fa'
import {
  SiLinux,
  SiUbuntu,
  SiDebian,
  SiProxmox,
  SiDocker,
  SiKubernetes,
  SiCisco,
  SiPfsense,
  SiFortinet,
  SiPaloaltonetworks,
  SiAnsible,
  SiTerraform,
  SiPuppet,
  SiSaltproject,
  SiGit,
  SiFlux,
  SiRancher,
  SiOracle,
  SiCloudflare,
  SiCilium,
  SiPortainer,
  SiAsterisk,
  SiApache,
  SiNginx,
  SiMysql,
  SiWordpress,
  SiCpanel,
} from 'react-icons/si'
import {
  Shield,
  Server,
  Network,
  Cloud,
  HardDrive,
  Lock,
  Wifi,
  Terminal,
  CloudCog,
  Box,
} from 'lucide-react'

// Icon mapping - using direct imports for better tree-shaking
export const iconMap: { [key: string]: IconType } = {
  'simple-icons:linux': SiLinux,
  'mdi:ubuntu': SiUbuntu,
  'simple-icons:debian': SiDebian,
  'mdi:windows': Server,
  'simple-icons:proxmox': SiProxmox,
  'mdi:docker': SiDocker,
  'mdi:kubernetes': SiKubernetes,
  'lucide:box': Box,
  'simple-icons:cisco': SiCisco,
  'simple-icons:pfsense': SiPfsense,
  'simple-icons:fortinet': SiFortinet,
  'simple-icons:paloaltonetworks': SiPaloaltonetworks,
  'lucide:wifi': Wifi,
  'lucide:network': Network,
  'lucide:lock': Lock,
  'lucide:shield': Shield,
  'simple-icons:ansible': SiAnsible,
  'simple-icons:terraform': SiTerraform,
  'simple-icons:puppet': SiPuppet,
  'simple-icons:saltproject': SiSaltproject,
  'lucide:terminal': Terminal,
  'mdi:git': SiGit,
  'simple-icons:flux': SiFlux,
  'simple-icons:rancher': SiRancher,
  'lucide:cloud': Cloud,
  'simple-icons:oracle': SiOracle,
  'simple-icons:cloudflare': SiCloudflare,
  'lucide:server': Server,
  'lucide:cloud-cog': CloudCog,
  'simple-icons:cilium': SiCilium,
  'simple-icons:portainer': SiPortainer,
  'lucide:hard-drive': HardDrive,
  'simple-icons:asterisk': SiAsterisk,
  'simple-icons:apache': SiApache,
  'simple-icons:nginx': SiNginx,
  'simple-icons:mysql': SiMysql,
  'simple-icons:wordpress': SiWordpress,
  'simple-icons:cpanel': SiCpanel,
}

export function getIcon(logo: string): IconType {
  return iconMap[logo] || FaQuestionCircle
}

