'use client'
import { ALERT_SEVERITY_VALUES, ALERT_TYPE_VALUES } from "@/lib/constants"
import { Alert } from "@/types"
import { useState } from "react"

const ALERTS_MOCKUP: Alert[] = [
    {
        id: 'alert-001',
        nodeId: 'node-004',
        severity: ALERT_SEVERITY_VALUES.critical,
        type: ALERT_TYPE_VALUES.nodeOffline,
        message: 'Node-004 has not reported for over 6 hours.',
        resolved: false,
        createdAt: new Date().toDateString(),
        resolvedAt: null,
    },
    {
        id: 'alert-002',
        nodeId: 'relay-03',
        severity: ALERT_SEVERITY_VALUES.critical,
        type: ALERT_TYPE_VALUES.signalLost,
        message: 'Relay-03 upstream signal to Gateway-02 is unstable.',
        resolved: true,
        createdAt: new Date().toDateString(),
        resolvedAt: new Date().toDateString(),
    },
    {
        id: 'alert-003',
        nodeId: 'node-003',
        severity: ALERT_SEVERITY_VALUES.warning,
        type: ALERT_TYPE_VALUES.lowBattery,
        message: 'Node-003 battery is below 25%.',
        resolved: false,
        createdAt: new Date().toDateString(),
        resolvedAt: null,
    },
    {
        id: 'alert-004',
        nodeId: 'node-006',
        severity: ALERT_SEVERITY_VALUES.warning,
        type: ALERT_TYPE_VALUES.lowBattery,
        message: 'Node-006 battery is below 20%.',
        resolved: true,
        createdAt: new Date().toDateString(),
        resolvedAt: new Date().toDateString(),
    },
    {
        id: 'alert-005',
        nodeId: 'gateway-01',
        severity: ALERT_SEVERITY_VALUES.info,
        type: ALERT_TYPE_VALUES.firmwareUpdateAvailable,
        message: 'Firmware 1.4.3 available for Gateway-01.',
        resolved: false,
        createdAt: new Date().toDateString(),
        resolvedAt: null,
    },
    {
        id: 'alert-006',
        nodeId: 'node-008',
        severity: ALERT_SEVERITY_VALUES.info,
        type: ALERT_TYPE_VALUES.nodeReassociated,
        message: 'Node-008 re-associated to Relay-03 after route optimization.',
        resolved: true,
        createdAt: new Date().toDateString(),
        resolvedAt: new Date().toDateString(),
    },
]

const useAlerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>(ALERTS_MOCKUP)
    return { alerts }
}

export default function AlertsPage() {

    return (
        <div className="flex flex-col gap-6 p-8">
            <div>
                <h1 className="font-heading text-4xl font-bold text-foreground">
                    Alerts Feed
                </h1>
                <p className="mt-2 font-body text-base text-muted-foreground">
                    Monitor and manage network alerts and notifications
                </p>
            </div>
        </div>
    )
}