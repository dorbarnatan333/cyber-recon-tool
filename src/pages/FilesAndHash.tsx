import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Network, Globe, HardDrive, Shield, Monitor, Building, FileText, Settings, Download, Save, Search, Filter, MoreHorizontal, ChevronDown, ChevronUp, File, Folder, Lock, AlertTriangle, CheckCircle, XCircle, Eye, Hash, Calendar, User, Copy, Check, ExternalLink, MoreVertical, FileStack, ShieldCheck, RotateCcw, Cog, ChevronLeft, ChevronRight, Database, Info } from 'lucide-react'
import { Button, Card, CardHeader, CardContent, Badge, ThreatBadge } from '@/components/ui'
import { cn } from '@/lib/utils'
import StickyHeader, { BreadcrumbItem, EndpointStatus, SystemInfo } from '@/components/StickyHeader'
import '../styles/design-system.css'

// Configuration
const ITEMS_PER_PAGE = 25
const TOTAL_FILES = 40
const TOTAL_PAGES = Math.ceil(TOTAL_FILES / ITEMS_PER_PAGE) // 2 pages

// Mock data for files and hash analysis - 40 files dataset
const mockFiles = [
  // Page 1 (Files 1-25)
  { id: '1', name: 'system32.dll', path: 'C:\\Windows\\System32\\system32.dll', size: '2.4 MB', file_type: 'Dynamic Link Library', status: 'clean', threat_level: 'low', signature: 'Microsoft Corporation', signature_status: 'signed', modified: '2024-11-15T10:30:00Z', prevalence: 'common', hash: { md5: 'a1b2c3d4e5f6789012345678901234ab', sha1: '1234567890abcdef1234567890abcdef12345678', sha256: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '2', name: 'malware.exe', path: 'C:\\Temp\\malware.exe', size: '1.1 MB', file_type: 'PE32 Executable', status: 'quarantined', threat_level: 'high', signature: 'Unsigned', signature_status: 'unsigned', modified: '2024-11-18T08:15:00Z', prevalence: 'rare', hash: { md5: 'deadbeefcafebabe1234567890123456', sha1: 'cafebabe1234567890abcdef1234567890abcdef', sha256: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' }, threat_intel: { virustotal: { detections: 23, total: 70 } } },
  { id: '3', name: 'document.pdf', path: 'C:\\Users\\Admin\\Documents\\document.pdf', size: '856 KB', file_type: 'PDF Document', status: 'clean', threat_level: 'low', signature: 'Adobe Systems Inc.', signature_status: 'signed', modified: '2024-11-17T14:20:00Z', prevalence: 'common', hash: { md5: '9876543210fedcba9876543210fedcba', sha1: 'fedcba9876543210fedcba9876543210fedcba98', sha256: 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210' }, threat_intel: { virustotal: { detections: 1, total: 70 } } },
  { id: '4', name: 'config.tmp', path: 'C:\\AppData\\Temp\\config.tmp', size: '12 KB', file_type: 'Temporary File', status: 'analyzing', threat_level: 'medium', signature: 'Unsigned', signature_status: 'unsigned', modified: '2024-11-18T11:45:00Z', prevalence: 'uncommon', hash: { md5: '11223344556677889900aabbccddeeff', sha1: '1122334455667788990011223344556677889900', sha256: '1122334455667788990011223344556677889900112233445566778899001122' }, threat_intel: { virustotal: { detections: 0, total: 0 } } },
  { id: '5', name: 'kernel32.dll', path: 'C:\\Windows\\System32\\kernel32.dll', size: '3.2 MB', file_type: 'Dynamic Link Library', status: 'clean', threat_level: 'low', signature: 'Microsoft Corporation', signature_status: 'signed', modified: '2024-10-20T10:30:00Z', prevalence: 'common', hash: { md5: 'aabbccddeeff001122334455667788', sha1: 'aabbccddeeff00112233445566778899aabbcc', sha256: 'aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '6', name: 'readme.txt', path: 'C:\\Program Files\\MyApp\\readme.txt', size: '4 KB', file_type: 'Text File', status: 'clean', threat_level: 'low', signature: null, signature_status: 'unsigned', modified: '2024-09-15T12:00:00Z', prevalence: 'unique', hash: { md5: '112233445566778899aabbccddeeff00', sha1: '112233445566778899aabbccddeeff0011223344', sha256: '112233445566778899aabbccddeeff00112233445566778899aabbccddeeff00' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '7', name: 'trojan.dll', path: 'C:\\Users\\Public\\Downloads\\trojan.dll', size: '890 KB', file_type: 'Dynamic Link Library', status: 'quarantined', threat_level: 'high', signature: 'Unsigned', signature_status: 'unsigned', modified: '2024-11-17T16:22:00Z', prevalence: 'rare', hash: { md5: 'ffeeddccbbaa998877665544332211', sha1: 'ffeeddccbbaa99887766554433221100ffeeddcc', sha256: 'ffeeddccbbaa99887766554433221100ffeeddccbbaa99887766554433221100' }, threat_intel: { virustotal: { detections: 45, total: 70 } } },
  { id: '8', name: 'invoice.pdf', path: 'C:\\Users\\Admin\\Downloads\\invoice.pdf', size: '245 KB', file_type: 'PDF Document', status: 'clean', threat_level: 'low', signature: 'Adobe Systems Inc.', signature_status: 'signed', modified: '2024-11-10T09:15:00Z', prevalence: 'common', hash: { md5: '99887766554433221100ffeeddccbbaa', sha1: '99887766554433221100ffeeddccbbaa99887766', sha256: '99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '9', name: 'user32.dll', path: 'C:\\Windows\\System32\\user32.dll', size: '1.8 MB', file_type: 'Dynamic Link Library', status: 'clean', threat_level: 'low', signature: 'Microsoft Corporation', signature_status: 'signed', modified: '2024-10-25T14:30:00Z', prevalence: 'common', hash: { md5: '5544332211009988776655443322110', sha1: '554433221100998877665544332211005544332', sha256: '5544332211009988776655443322110055443322110099887766554433221100' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '10', name: 'temp_data.dat', path: 'C:\\ProgramData\\Temp\\temp_data.dat', size: '156 KB', file_type: 'Data File', status: 'analyzing', threat_level: 'medium', signature: 'Unsigned', signature_status: 'unsigned', modified: '2024-11-18T13:22:00Z', prevalence: 'rare', hash: { md5: '3322110099887766554433221100998', sha1: '332211009988776655443322110099887766554', sha256: '3322110099887766554433221100998877665544332211009988776655443322' }, threat_intel: { virustotal: { detections: 0, total: 0 } } },
  { id: '11', name: 'config.ini', path: 'C:\\Program Files\\App\\config.ini', size: '2 KB', file_type: 'Configuration File', status: 'clean', threat_level: 'low', signature: null, signature_status: 'unsigned', modified: '2024-08-12T11:00:00Z', prevalence: 'common', hash: { md5: '776655443322110099887766554433221', sha1: '77665544332211009988776655443322110099887', sha256: '7766554433221100998877665544332211009988776655443322110099887766' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '12', name: 'ntdll.dll', path: 'C:\\Windows\\System32\\ntdll.dll', size: '2.1 MB', file_type: 'Dynamic Link Library', status: 'clean', threat_level: 'low', signature: 'Microsoft Corporation', signature_status: 'signed', modified: '2024-10-18T16:45:00Z', prevalence: 'common', hash: { md5: '1122334455667788990011223344556', sha1: '112233445566778899001122334455667788990', sha256: '1122334455667788990011223344556677889900112233445566778899001122' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '13', name: 'report.docx', path: 'C:\\Users\\Admin\\Documents\\report.docx', size: '1.2 MB', file_type: 'Word Document', status: 'clean', threat_level: 'low', signature: null, signature_status: 'unsigned', modified: '2024-11-05T10:20:00Z', prevalence: 'unique', hash: { md5: '6677889900112233445566778899001', sha1: '667788990011223344556677889900112233445', sha256: '6677889900112233445566778899001122334455667788990011223344556677' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '14', name: 'keylogger.exe', path: 'C:\\Users\\Public\\keylogger.exe', size: '450 KB', file_type: 'PE32 Executable', status: 'quarantined', threat_level: 'medium', signature: 'Unsigned', signature_status: 'unsigned', modified: '2024-11-16T19:33:00Z', prevalence: 'rare', hash: { md5: '9900112233445566778899001122334', sha1: '990011223344556677889900112233445566778', sha256: '9900112233445566778899001122334455667788990011223344556677889900' }, threat_intel: { virustotal: { detections: 12, total: 70 } } },
  { id: '15', name: 'cache.db', path: 'C:\\Users\\Admin\\AppData\\Local\\cache.db', size: '3.4 MB', file_type: 'Database File', status: 'clean', threat_level: 'low', signature: null, signature_status: 'unsigned', modified: '2024-11-18T15:11:00Z', prevalence: 'common', hash: { md5: '4455667788990011223344556677889', sha1: '445566778899001122334455667788990011223', sha256: '4455667788990011223344556677889900112233445566778899001122334455' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '16', name: 'gdi32.dll', path: 'C:\\Windows\\System32\\gdi32.dll', size: '890 KB', file_type: 'Dynamic Link Library', status: 'clean', threat_level: 'low', signature: 'Microsoft Corporation', signature_status: 'signed', modified: '2024-10-22T13:15:00Z', prevalence: 'common', hash: { md5: '8899001122334455667788990011223', sha1: '889900112233445566778899001122334455667', sha256: '8899001122334455667788990011223344556677889900112233445566778899' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '17', name: 'notes.txt', path: 'C:\\Users\\Admin\\Desktop\\notes.txt', size: '8 KB', file_type: 'Text File', status: 'clean', threat_level: 'low', signature: null, signature_status: 'unsigned', modified: '2024-11-12T14:33:00Z', prevalence: 'unique', hash: { md5: '2233445566778899001122334455667', sha1: '223344556677889900112233445566778899001', sha256: '2233445566778899001122334455667788990011223344556677889900112233' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '18', name: 'advapi32.dll', path: 'C:\\Windows\\System32\\advapi32.dll', size: '1.5 MB', file_type: 'Dynamic Link Library', status: 'clean', threat_level: 'low', signature: 'Microsoft Corporation', signature_status: 'signed', modified: '2024-10-19T12:22:00Z', prevalence: 'common', hash: { md5: '7788990011223344556677889900112', sha1: '778899001122334455667788990011223344556', sha256: '7788990011223344556677889900112233445566778899001122334455667788' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '19', name: 'presentation.pptx', path: 'C:\\Users\\Admin\\Documents\\presentation.pptx', size: '5.6 MB', file_type: 'PowerPoint Document', status: 'clean', threat_level: 'low', signature: null, signature_status: 'unsigned', modified: '2024-10-28T16:45:00Z', prevalence: 'unique', hash: { md5: '0011223344556677889900112233445', sha1: '001122334455667788990011223344556677889', sha256: '0011223344556677889900112233445566778899001122334455667788990011' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '20', name: 'suspicious_script.ps1', path: 'C:\\Users\\Public\\suspicious_script.ps1', size: '34 KB', file_type: 'PowerShell Script', status: 'quarantined', threat_level: 'medium', signature: 'Unsigned', signature_status: 'unsigned', modified: '2024-11-15T11:22:00Z', prevalence: 'rare', hash: { md5: '5566778899001122334455667788990', sha1: '556677889900112233445566778899001122334', sha256: '5566778899001122334455667788990011223344556677889900112233445566' }, threat_intel: { virustotal: { detections: 8, total: 70 } } },
  { id: '21', name: 'session.tmp', path: 'C:\\Windows\\Temp\\session.tmp', size: '24 KB', file_type: 'Temporary File', status: 'analyzing', threat_level: 'low', signature: 'Unsigned', signature_status: 'unsigned', modified: '2024-11-18T17:55:00Z', prevalence: 'common', hash: { md5: 'aabbccddee1122334455667788990011', sha1: 'aabbccddee112233445566778899001122334455', sha256: 'aabbccddee11223344556677889900112233445566778899001122334455aabb' }, threat_intel: { virustotal: { detections: 0, total: 0 } } },
  { id: '22', name: 'ws2_32.dll', path: 'C:\\Windows\\System32\\ws2_32.dll', size: '412 KB', file_type: 'Dynamic Link Library', status: 'clean', threat_level: 'low', signature: 'Microsoft Corporation', signature_status: 'signed', modified: '2024-10-21T09:33:00Z', prevalence: 'common', hash: { md5: 'ccddee1122334455667788990011223', sha1: 'ccddee112233445566778899001122334455667', sha256: 'ccddee1122334455667788990011223344556677889900112233445566ccddee' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '23', name: 'budget.xlsx', path: 'C:\\Users\\Admin\\Documents\\budget.xlsx', size: '890 KB', file_type: 'Excel Spreadsheet', status: 'clean', threat_level: 'low', signature: null, signature_status: 'unsigned', modified: '2024-11-01T13:44:00Z', prevalence: 'unique', hash: { md5: 'ddee112233445566778899001122334', sha1: 'ddee11223344556677889900112233445566778', sha256: 'ddee112233445566778899001122334455667788990011223344556677ddee11' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '24', name: 'comctl32.dll', path: 'C:\\Windows\\System32\\comctl32.dll', size: '2.3 MB', file_type: 'Dynamic Link Library', status: 'clean', threat_level: 'low', signature: 'Microsoft Corporation', signature_status: 'signed', modified: '2024-10-17T14:22:00Z', prevalence: 'common', hash: { md5: 'ee11223344556677889900112233445', sha1: 'ee1122334455667788990011223344556677889', sha256: 'ee112233445566778899001122334455667788990011223344556677889900ee' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '25', name: 'log.txt', path: 'C:\\ProgramData\\App\\log.txt', size: '156 KB', file_type: 'Text File', status: 'clean', threat_level: 'low', signature: null, signature_status: 'unsigned', modified: '2024-11-18T18:11:00Z', prevalence: 'common', hash: { md5: 'ff112233445566778899001122334455', sha1: 'ff11223344556677889900112233445566778899', sha256: 'ff112233445566778899001122334455667788990011223344556677889900ff' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },

  // Page 2 (Files 26-40)
  { id: '26', name: 'shell32.dll', path: 'C:\\Windows\\System32\\shell32.dll', size: '4.1 MB', file_type: 'Dynamic Link Library', status: 'clean', threat_level: 'low', signature: 'Microsoft Corporation', signature_status: 'signed', modified: '2024-10-16T15:33:00Z', prevalence: 'common', hash: { md5: '001122334455667788990011223344aa', sha1: '001122334455667788990011223344556677889aa', sha256: '001122334455667788990011223344556677889900112233445566778899aa00' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '27', name: 'contract.pdf', path: 'C:\\Users\\Admin\\Documents\\contract.pdf', size: '678 KB', file_type: 'PDF Document', status: 'clean', threat_level: 'low', signature: 'Adobe Systems Inc.', signature_status: 'signed', modified: '2024-09-22T10:15:00Z', prevalence: 'unique', hash: { md5: '112233445566778899001122334455bb', sha1: '112233445566778899001122334455667788bb00', sha256: '112233445566778899001122334455667788990011223344556677889900bb11' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '28', name: 'backdoor.bat', path: 'C:\\Users\\Public\\backdoor.bat', size: '2 KB', file_type: 'Batch Script', status: 'quarantined', threat_level: 'low', signature: 'Unsigned', signature_status: 'unsigned', modified: '2024-11-14T20:44:00Z', prevalence: 'rare', hash: { md5: '22334455667788990011223344556cc', sha1: '223344556677889900112233445566778899cc11', sha256: '223344556677889900112233445566778899001122334455667788990011cc22' }, threat_intel: { virustotal: { detections: 3, total: 70 } } },
  { id: '29', name: 'update.cab', path: 'C:\\Windows\\SoftwareDistribution\\update.cab', size: '12.3 MB', file_type: 'Cabinet Archive', status: 'clean', threat_level: 'low', signature: 'Microsoft Corporation', signature_status: 'signed', modified: '2024-11-10T12:22:00Z', prevalence: 'common', hash: { md5: '334455667788990011223344556677dd', sha1: '334455667788990011223344556677889900dd22', sha256: '334455667788990011223344556677889900112233445566778899001122dd33' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '30', name: 'oleaut32.dll', path: 'C:\\Windows\\System32\\oleaut32.dll', size: '1.9 MB', file_type: 'Dynamic Link Library', status: 'clean', threat_level: 'low', signature: 'Microsoft Corporation', signature_status: 'signed', modified: '2024-10-15T11:55:00Z', prevalence: 'common', hash: { md5: '4455667788990011223344556677ee88', sha1: '445566778899001122334455667788990011ee33', sha256: '445566778899001122334455667788990011223344556677889900112233ee44' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '31', name: 'rpcrt4.dll', path: 'C:\\Windows\\System32\\rpcrt4.dll', size: '1.6 MB', file_type: 'Dynamic Link Library', status: 'clean', threat_level: 'low', signature: 'Microsoft Corporation', signature_status: 'signed', modified: '2024-10-14T16:11:00Z', prevalence: 'common', hash: { md5: '556677889900112233445566778899ff', sha1: '556677889900112233445566778899001122ff44', sha256: '556677889900112233445566778899001122334455667788990011223344ff55' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '32', name: 'setup.exe', path: 'C:\\Users\\Admin\\Downloads\\setup.exe', size: '8.5 MB', file_type: 'PE32 Executable', status: 'clean', threat_level: 'low', signature: 'Generic Software Inc.', signature_status: 'signed', modified: '2024-11-08T14:33:00Z', prevalence: 'uncommon', hash: { md5: '66778899001122334455667788990000', sha1: '667788990011223344556677889900112233000', sha256: '6677889900112233445566778899001122334455667788990011223344556600' }, threat_intel: { virustotal: { detections: 2, total: 70 } } },
  { id: '33', name: 'secur32.dll', path: 'C:\\Windows\\System32\\secur32.dll', size: '345 KB', file_type: 'Dynamic Link Library', status: 'clean', threat_level: 'low', signature: 'Microsoft Corporation', signature_status: 'signed', modified: '2024-10-13T12:44:00Z', prevalence: 'common', hash: { md5: '77889900112233445566778899001111', sha1: '778899001122334455667788990011223344111', sha256: '7788990011223344556677889900112233445566778899001122334455667711' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '34', name: 'ransomware.exe', path: 'C:\\Temp\\ransomware.exe', size: '2.8 MB', file_type: 'PE32 Executable', status: 'quarantined', threat_level: 'high', signature: 'Unsigned', signature_status: 'unsigned', modified: '2024-11-18T19:22:00Z', prevalence: 'rare', hash: { md5: '88990011223344556677889900112222', sha1: '889900112233445566778899001122334455222', sha256: '8899001122334455667788990011223344556677889900112233445566778822' }, threat_intel: { virustotal: { detections: 67, total: 70 } } },
  { id: '35', name: 'crypt32.dll', path: 'C:\\Windows\\System32\\crypt32.dll', size: '1.4 MB', file_type: 'Dynamic Link Library', status: 'clean', threat_level: 'low', signature: 'Microsoft Corporation', signature_status: 'signed', modified: '2024-10-12T17:55:00Z', prevalence: 'common', hash: { md5: '99001122334455667788990011223333', sha1: '990011223344556677889900112233445566333', sha256: '9900112233445566778899001122334455667788990011223344556677889933' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '36', name: 'timeline.json', path: 'C:\\Users\\Admin\\AppData\\Local\\timeline.json', size: '89 KB', file_type: 'JSON File', status: 'clean', threat_level: 'low', signature: null, signature_status: 'unsigned', modified: '2024-11-17T13:22:00Z', prevalence: 'unique', hash: { md5: '00112233445566778899001122334444', sha1: '001122334455667788990011223344556677444', sha256: '0011223344556677889900112233445566778899001122334455667788994400' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '37', name: 'msvcp140.dll', path: 'C:\\Windows\\System32\\msvcp140.dll', size: '622 KB', file_type: 'Dynamic Link Library', status: 'clean', threat_level: 'low', signature: 'Microsoft Corporation', signature_status: 'signed', modified: '2024-10-11T18:11:00Z', prevalence: 'common', hash: { md5: '11223344556677889900112233445555', sha1: '112233445566778899001122334455667788555', sha256: '1122334455667788990011223344556677889900112233445566778899005511' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '38', name: 'exploit.vbs', path: 'C:\\Users\\Public\\Documents\\exploit.vbs', size: '12 KB', file_type: 'VBScript File', status: 'quarantined', threat_level: 'medium', signature: 'Unsigned', signature_status: 'unsigned', modified: '2024-11-13T21:33:00Z', prevalence: 'rare', hash: { md5: '22334455667788990011223344556666', sha1: '223344556677889900112233445566778899666', sha256: '2233445566778899001122334455667788990011223344556677889900112266' }, threat_intel: { virustotal: { detections: 15, total: 70 } } },
  { id: '39', name: 'vcruntime140.dll', path: 'C:\\Windows\\System32\\vcruntime140.dll', size: '86 KB', file_type: 'Dynamic Link Library', status: 'clean', threat_level: 'low', signature: 'Microsoft Corporation', signature_status: 'signed', modified: '2024-10-10T19:44:00Z', prevalence: 'common', hash: { md5: '33445566778899001122334455667777', sha1: '334455667788990011223344556677889900777', sha256: '3344556677889900112233445566778899001122334455667788990011223377' }, threat_intel: { virustotal: { detections: 0, total: 70 } } },
  { id: '40', name: 'settings.xml', path: 'C:\\ProgramData\\App\\settings.xml', size: '18 KB', file_type: 'XML File', status: 'clean', threat_level: 'low', signature: null, signature_status: 'unsigned', modified: '2024-11-16T14:55:00Z', prevalence: 'common', hash: { md5: '44556677889900112233445566778888', sha1: '445566778899001122334455667788990011888', sha256: '4455667788990011223344556677889900112233445566778899001122334488' }, threat_intel: { virustotal: { detections: 0, total: 70 } } }
]

// Status Badge Components
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'clean':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'quarantined':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'analyzing':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clean':
        return <CheckCircle className="w-3 h-3" />
      case 'quarantined':
        return <XCircle className="w-3 h-3" />
      case 'analyzing':
        return <AlertTriangle className="w-3 h-3" />
      default:
        return <File className="w-3 h-3" />
    }
  }

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
      getStatusStyle(status)
    )}>
      {getStatusIcon(status)}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const ThreatLevelBadge: React.FC<{ level: string }> = ({ level }) => {
  const getThreatStyle = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
      getThreatStyle(level)
    )}>
      {level.toUpperCase()}
    </span>
  )
}

// Copy Hash Component
const CopyableHash: React.FC<{ hash: string; type: string }> = ({ hash, type }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded border">
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-500 font-medium">{type.toUpperCase()}:</div>
        <code className="text-xs font-mono text-slate-700 break-all">{hash}</code>
      </div>
      <button
        onClick={handleCopy}
        className="ml-2 p-1 hover:bg-slate-200 rounded transition-colors"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="w-3 h-3 text-green-600" />
        ) : (
          <Copy className="w-3 h-3 text-slate-500" />
        )}
      </button>
    </div>
  )
}

// Action Menu Component
const FileActionMenu: React.FC<{ file: typeof mockFiles[0] }> = ({ file }) => {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    { icon: Search, label: 'Investigate Hash', action: () => console.log('Investigate', file.name) },
    { icon: ExternalLink, label: 'Check VirusTotal', action: () => console.log('VirusTotal', file.name) },
    { icon: CheckCircle, label: 'Whitelist', action: () => console.log('Whitelist', file.name) },
    { icon: XCircle, label: 'Blacklist', action: () => console.log('Blacklist', file.name) },
    { icon: Download, label: 'Export Details', action: () => console.log('Export', file.name) },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-slate-100 rounded transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-slate-500" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg min-w-[180px] z-50">
          <div className="py-1">
            {actions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  onClick={() => {
                    action.action()
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{action.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// Signature Status Component
const SignatureStatus: React.FC<{ status: string; publisher: string }> = ({ status, publisher }) => {
  if (status === 'signed') {
    return <span className="text-green-700">✓ Signed by {publisher}</span>
  }
  
  if (!publisher || publisher === 'Unsigned') {
    return <span className="text-orange-600">⚠️ Unsigned</span>
  }
  
  return <span className="text-slate-600">No signature</span>
}

// Threat Intelligence Badge
const ThreatIntelBadge: React.FC<{ intel: any }> = ({ intel }) => {
  if (!intel.virustotal) return null
  
  const { detections, total } = intel.virustotal
  const isClean = detections === 0
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
      isClean ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
    )}>
      <ExternalLink className="w-3 h-3" />
      <span>VT: {detections}/{total}</span>
    </div>
  )
}

const FilesAndHash: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [files, setFiles] = useState(mockFiles)
  const [selectedFile, setSelectedFile] = useState<typeof mockFiles[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [threatFilter, setThreatFilter] = useState('all')
  const [expandedHashes, setExpandedHashes] = useState<Set<string>>(new Set())
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Create system info for StickyHeader
  const systemInfo: SystemInfo = {
    avatar: 'T',
    name: 'Truth',
    context: 'Files & Hash'
  }

  // Create breadcrumbs for StickyHeader
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Investigation', link: `/investigate/${deviceId}` },
    { label: 'Files & Hash', link: null } // Current page
  ]

  // Create endpoint status for StickyHeader
  const endpointStatus: EndpointStatus = {
    type: 'active',
    label: 'Active',
    lastSeen: '2 minutes ago'
  }

  // StickyHeader action handlers
  const handleSave = () => {
    console.log('Saving files analysis for device:', deviceId)
    alert('Files analysis saved successfully!')
  }

  const handleExport = (format: 'json' | 'pdf' | 'csv' | 'email') => {
    console.log('Exporting files analysis as:', format, 'for device:', deviceId)
    alert(`Exporting files analysis as ${format.toUpperCase()}...`)
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  const handleSettings = () => {
    console.log('Opening files analysis settings for device:', deviceId)
    alert('Files analysis settings would open here')
  }

  // Filter files based on search and filters
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.path.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || file.status === statusFilter
    const matchesThreat = threatFilter === 'all' || file.threat_level === threatFilter
    
    return matchesSearch && matchesStatus && matchesThreat
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredFiles.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedFiles = filteredFiles.slice(startIndex, endIndex)
  
  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setExpandedHashes(new Set()) // Reset expanded states on page change
    }
  }
  
  const goToPreviousPage = () => goToPage(currentPage - 1)
  const goToNextPage = () => goToPage(currentPage + 1)
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, threatFilter])

  // Calculate statistics from the mock data
  const stats = {
    totalFiles: files.length,
    cleanFiles: files.filter(f => f.status === 'clean').length,
    threats: files.filter(f => f.status === 'quarantined').length,
    analyzing: files.filter(f => f.status === 'analyzing').length
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatHash = (hash: string, type: string) => {
    return `${type.toUpperCase()}: ${hash.slice(0, 16)}...`
  }

  const toggleHashExpansion = (fileId: string) => {
    const newExpanded = new Set(expandedHashes)
    if (newExpanded.has(fileId)) {
      newExpanded.delete(fileId)
    } else {
      newExpanded.add(fileId)
    }
    setExpandedHashes(newExpanded)
  }

  const toggleFileSelection = (fileId: string) => {
    const newSelected = new Set(selectedFiles)
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId)
    } else {
      newSelected.add(fileId)
    }
    setSelectedFiles(newSelected)
  }

  const selectAllFiles = () => {
    if (selectedFiles.size === paginatedFiles.length) {
      setSelectedFiles(new Set())
    } else {
      setSelectedFiles(new Set(paginatedFiles.map(f => f.id)))
    }
  }

  const getThreatsBreakdown = () => {
    const threats = files.filter(f => f.status === 'quarantined' || f.threat_level !== 'low')
    return {
      high: threats.filter(f => f.threat_level === 'high').length,
      medium: threats.filter(f => f.threat_level === 'medium').length,
      low: threats.filter(f => f.threat_level === 'low' && f.status === 'quarantined').length
    }
  }

  // Simple loading state
  const LoadingContent = () => (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="flex space-x-2 justify-center mb-6">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <h2 className="text-lg font-medium text-slate-900 dark:text-gray-50 mb-2">
          Loading Files Analysis
        </h2>
        <p className="text-sm text-slate-600 dark:text-gray-400">
          Analyzing files for {deviceId}...
        </p>
      </div>
    </div>
  )

  // Check for no deviceId and redirect
  if (!deviceId) {
    navigate('/search/results')
    return null
  }

  return (
    <>
      {/* Sticky Header */}
      <StickyHeader
        systemInfo={systemInfo}
        breadcrumbs={breadcrumbs}
        endpointStatus={endpointStatus}
        onSave={handleSave}
        onExport={handleExport}
        onRefresh={handleRefresh}
        onSettings={handleSettings}
        isLoading={isLoading}
      />

      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 pt-16">
        {/* Dedicated Sidebar for Investigation */}
        <div className="w-64 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-r border-slate-200/60 flex flex-col shadow-lg fixed left-0 top-16 bottom-0 overflow-y-auto">
          {/* Navigation */}
          <nav className="flex-1 p-4 pt-6 space-y-2">
            {[
              { name: 'Overview', href: `/investigate/${deviceId}`, icon: Monitor },
              { name: 'Network Analysis', href: `/investigate/${deviceId}/network`, icon: Network },
              { name: 'Browser Analysis', href: `/investigate/${deviceId}/browsers`, icon: Globe },
              { name: 'Files & Hash', href: `/investigate/${deviceId}/files`, icon: HardDrive, active: true },
              { name: 'Security Events', href: `/investigate/${deviceId}/security`, icon: Shield },
              { name: 'Data Sources', href: `/investigate/${deviceId}/sources`, icon: Database },
              { name: 'System Information', href: `/investigate/${deviceId}/system-info`, icon: Info },
              { name: 'Company Context', href: `/investigate/${deviceId}/company`, icon: Building },
              { name: 'Reports', href: `/investigate/${deviceId}/reports`, icon: FileText },
              { name: 'Settings', href: `/investigate/${deviceId}/settings`, icon: Settings },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.name}
                  onClick={() => !item.active && navigate(item.href)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    item.active
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-gray-50 hover:bg-white/60 dark:hover:bg-gray-700/50 hover:backdrop-blur-lg cursor-pointer'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              )
            })}
          </nav>

          {/* Status Footer */}
          <div className="p-4 border-t border-slate-200/60 dark:border-gray-700/60">
            <div className="backdrop-blur-lg bg-blue-50/80 dark:bg-blue-900/30 rounded-xl p-3 border border-blue-200/50 dark:border-blue-700/40">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-slate-700 dark:text-gray-300">Analysis Active</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-gray-400">Device: {deviceId}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden ml-64">
          <main className="flex-1 overflow-auto p-6 relative min-h-screen">
            {/* Show loading state or content */}
            {isLoading ? (
              <LoadingContent />
            ) : (
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Page Header */}
                <div className="mb-6">
                  <h1 className="text-heading text-2xl font-bold text-slate-900 dark:text-gray-50 mb-2">
                    Files & Hash Analysis: {deviceId}
                  </h1>
                  <p className="text-body-sm text-slate-600 dark:text-gray-300">
                    Comprehensive file system analysis and hash verification for endpoint security
                  </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card variant="glass">
                    <CardContent className="p-4 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <FileStack className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Total Files</p>
                          <p className="text-2xl font-bold text-slate-900">{files.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card variant="glass">
                    <CardContent className="p-4 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Clean Files</p>
                          <p className="text-2xl font-bold text-green-600">{files.filter(f => f.status === 'clean').length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card variant="glass">
                    <CardContent className="p-4 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Threats</p>
                          <p className="text-2xl font-bold text-red-600">{files.filter(f => f.status === 'quarantined').length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card variant="glass">
                    <CardContent className="p-4 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <RotateCcw className="w-5 h-5 text-yellow-600 animate-spin" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Analyzing</p>
                          <p className="text-2xl font-bold text-yellow-600">{files.filter(f => f.status === 'analyzing').length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Filters and Search */}
                <Card variant="glass">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50">File Analysis</h3>
                      <div className="flex items-center space-x-3">
                        {/* Search */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search files..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                          />
                        </div>
                        
                        {/* Status Filter */}
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                        >
                          <option value="all">All Status</option>
                          <option value="clean">Clean</option>
                          <option value="quarantined">Quarantined</option>
                          <option value="analyzing">Analyzing</option>
                        </select>

                        {/* Threat Filter */}
                        <select
                          value={threatFilter}
                          onChange={(e) => setThreatFilter(e.target.value)}
                          className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                        >
                          <option value="all">All Threats</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Bulk Actions Header */}
                    {selectedFiles.size > 0 && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-900">
                            {selectedFiles.size} file{selectedFiles.size > 1 ? 's' : ''} selected
                          </span>
                          <div className="flex items-center space-x-2">
                            <Button variant="secondary" size="sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Whitelist
                            </Button>
                            <Button variant="secondary" size="sm">
                              <XCircle className="w-4 h-4 mr-1" />
                              Blacklist
                            </Button>
                            <Button variant="secondary" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Select All Checkbox */}
                    <div className="mb-4 flex items-center space-x-3 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedFiles.size === paginatedFiles.length && paginatedFiles.length > 0}
                        onChange={selectAllFiles}
                        className="rounded border-slate-300"
                      />
                      <span className="text-slate-600">Select all files</span>
                    </div>

                    <div className="space-y-3">
                      {paginatedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="border border-slate-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-sm transition-all duration-200 bg-white"
                        >
                          {/* File Header Row */}
                          <div className="flex items-center space-x-3 mb-3">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={selectedFiles.has(file.id)}
                              onChange={() => toggleFileSelection(file.id)}
                              className="rounded border-slate-300"
                              onClick={(e) => e.stopPropagation()}
                            />
                            
                            {/* File Icon */}
                            <div className="flex-shrink-0">
                              {file.file_type.includes('Executable') ? (
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                  <Settings className="w-5 h-5 text-red-600" />
                                </div>
                              ) : file.file_type.includes('PDF') ? (
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-red-600" />
                                </div>
                              ) : file.file_type.includes('DLL') ? (
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Settings className="w-5 h-5 text-blue-600" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                  <File className="w-5 h-5 text-gray-600" />
                                </div>
                              )}
                            </div>
                            
                            {/* Filename and Status Badge */}
                            <div className="flex items-center space-x-2">
                              <h4 className="text-base font-semibold text-slate-900">{file.name}</h4>
                              <StatusBadge status={file.status} />
                            </div>
                          </div>
                          
                          {/* File Path Row */}
                          <div className="mb-3 ml-13">
                            <p className="text-sm text-slate-500 font-mono" title={file.path}>{file.path}</p>
                          </div>
                          
                          {/* Metadata Row */}
                          <div className="flex items-center text-sm text-slate-600 mb-2 ml-13">
                            <span>Size: {file.size}</span>
                            <span className="mx-2 text-slate-400">•</span>
                            <span>Type: {file.file_type}</span>
                            <span className="mx-2 text-slate-400">•</span>
                            <span>Modified: {new Date(file.modified).toLocaleDateString()}</span>
                          </div>
                          
                          {/* Security Row */}
                          <div className="flex items-center text-sm text-slate-600 mb-4 ml-13">
                            <SignatureStatus status={file.signature_status} publisher={file.signature} />
                            <span className="mx-2 text-slate-400">•</span>
                            <span>Prevalence: {file.prevalence}</span>
                            {(file.status === 'quarantined' || file.status === 'analyzing') && file.threat_intel.virustotal && (
                              <>
                                <span className="mx-2 text-slate-400">•</span>
                                <span>
                                  {file.status === 'analyzing' 
                                    ? 'Analysis in progress...'
                                    : `VirusTotal: ${file.threat_intel.virustotal.detections}/${file.threat_intel.virustotal.total} vendors`
                                  }
                                </span>
                              </>
                            )}
                          </div>
                          
                          {/* Action Row */}
                          <div className="ml-13">
                            <button
                              onClick={() => toggleHashExpansion(file.id)}
                              className="px-4 py-2 text-sm border border-slate-300 rounded-md bg-white hover:bg-slate-50 font-medium text-slate-700 transition-colors"
                            >
                              {expandedHashes.has(file.id) ? 'Hide Hashes' : 'Show Hashes'}
                            </button>
                          </div>

                          {/* Expanded Hash Section */}
                          {expandedHashes.has(file.id) && (
                            <div className="border-t border-slate-200 mt-4 pt-4 ml-13">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2 mb-3">
                                  <Hash className="w-4 h-4 text-slate-500" />
                                  <span className="text-sm font-medium text-slate-700">File Hashes</span>
                                </div>
                                <CopyableHash hash={file.hash.md5} type="md5" />
                                <CopyableHash hash={file.hash.sha1} type="sha1" />
                                <CopyableHash hash={file.hash.sha256} type="sha256" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <Card variant="glass">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        {/* Page Info */}
                        <div className="text-sm text-slate-600">
                          Showing {startIndex + 1}-{Math.min(endIndex, filteredFiles.length)} of {filteredFiles.length} files
                        </div>
                        
                        {/* Pagination Controls */}
                        <div className="flex items-center space-x-2">
                          {/* Previous Button */}
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className="px-3 py-1"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          
                          {/* Page Numbers */}
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: totalPages }, (_, index) => {
                              const page = index + 1
                              const isCurrentPage = page === currentPage
                              
                              // Show first page, last page, current page, and pages around current
                              const showPage = page === 1 || 
                                              page === totalPages || 
                                              Math.abs(page - currentPage) <= 1
                              
                              if (!showPage) {
                                // Show ellipsis for skipped pages
                                if (page === currentPage - 2 || page === currentPage + 2) {
                                  return <span key={page} className="px-2 text-slate-400">...</span>
                                }
                                return null
                              }
                              
                              return (
                                <button
                                  key={page}
                                  onClick={() => goToPage(page)}
                                  className={cn(
                                    "px-3 py-1 text-sm rounded transition-colors",
                                    isCurrentPage
                                      ? "bg-blue-500 text-white"
                                      : "text-slate-600 hover:bg-slate-100"
                                  )}
                                >
                                  {page}
                                </button>
                              )
                            })}
                          </div>
                          
                          {/* Next Button */}
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* File Detail Modal/Panel */}
                {selectedFile && (
                  <Card variant="glass">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-50">File Details</h3>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                          ×
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Basic Information</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">Name:</span>
                              <span className="text-sm font-medium">{selectedFile.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">Path:</span>
                              <span className="text-sm font-medium truncate max-w-xs">{selectedFile.path}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">Size:</span>
                              <span className="text-sm font-medium">{selectedFile.size}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">Type:</span>
                              <span className="text-sm font-medium">{selectedFile.file_type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">Signature:</span>
                              <span className="text-sm font-medium">{selectedFile.signature}</span>
                            </div>
                          </div>
                        </div>

                        {/* Hash Information */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Hash Information</h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm text-slate-600 block mb-1">MD5:</span>
                              <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded break-all">
                                {selectedFile.hash.md5}
                              </code>
                            </div>
                            <div>
                              <span className="text-sm text-slate-600 block mb-1">SHA1:</span>
                              <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded break-all">
                                {selectedFile.hash.sha1}
                              </code>
                            </div>
                            <div>
                              <span className="text-sm text-slate-600 block mb-1">SHA256:</span>
                              <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded break-all">
                                {selectedFile.hash.sha256}
                              </code>
                            </div>
                          </div>
                        </div>

                        {/* Timestamps */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Timestamps</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">Modified:</span>
                              <span className="text-sm font-medium">{formatDate(selectedFile.modified)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">Accessed:</span>
                              <span className="text-sm font-medium">{formatDate(selectedFile.accessed)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Security */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Security</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">Status:</span>
                              <StatusBadge status={selectedFile.status} />
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">Threat Level:</span>
                              <ThreatLevelBadge level={selectedFile.threat_level} />
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">Permissions:</span>
                              <span className="text-sm font-medium">{selectedFile.permissions}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export default FilesAndHash