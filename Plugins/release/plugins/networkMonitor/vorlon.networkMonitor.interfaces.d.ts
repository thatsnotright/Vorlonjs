declare module VORLON {
    class PerformanceItem {
        name: string;
        type: string;
        startTime: number;
        duration: number;
        redirectStart: number;
        redirectDuration: number;
        dnsStart: number;
        dnsDuration: number;
        tcpStart: number;
        tcpDuration: number;
        requestStart: number;
        requestDuration: number;
        responseStart: number;
        responseDuration: number;
    }
}
