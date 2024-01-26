[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-purple.svg)](https://github.com/open-source-labs/Chronos)
![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)
![Release: 1.0](https://img.shields.io/badge/Release-1.0-purple)

# Kaleidoscope 🔭

## About 
Kaleidoscope is an innovative open-source observability tool designed for developers to visually explore and enhance the backend architecture of web applications. It provides a unique node map visualization, enabling the analysis of request latency across various endpoints and identification of performance bottlenecks.

Please read the [website](www.google.com) and [medium](https://medium.com/@rbrtm984/a8f0f763de83) article for more information.
### Features
- Annotate nodes and node data for detailed insights.
- Upcoming enhancements include a Node map sandbox, Trace movement visualization, and much more.

### Upcoming Features
- Node map sandbox
- Trace movement visualization
- Implement map saving and users saving maps
- Populating the annotations on the map so they correspond to their location in the architecture
- Rework Node Map to D3
- Account information after log in
- OAuth
- Hosted demo of application
- Hosted Splash Page
- Individual trace information (waterfall)
- "Refresh" button to find new traces for system
- npm package
- Finish conversion of backend to Go

## Prerequisites 
- To use Kaleidoscope, you can instrument your application using OpenTelemetry, and export the data to the containerized version of the OpenTelemetry Collector that runs in tandem with this app. If your application is writtten in Node.js it can be instrumented automatically by running the application while requiring [instrumentation.js](https://github.com/oslabs-beta/Kaleidoscope/blob/dev/instrumentation.js):

```
$ node --require ./instrumentation.js <entry point to your application>
```

- Ensure the environment variable in your application for the OTel collector is set as follows:
```
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317
```


## Getting Started
- Once you've instrumented your application to emit telemetry data, start the OTel collector in a Docker container:
```
$ cd otel-collector && docker compose up
```
- Telemetry data should now be transmitted to Kaleidoscope as requests travel through your app!
- Open Kaleidoscope from the root directory:
```
$ npm run start-dev
```
- Register / Sign in to generate a node map of your app's latest trace data (Registration/Signin is implemented locally for Kaleidoscope)

## Technology Stack 
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![OpenTelemetry](https://img.shields.io/badge/OpenTelemetry-3d348b?style=for-the-badge&logo=opentelemetry&logoColor=white)

## The Developers 
- Robert Mayo | [GitHub](https://github.com/rbrtm984) | [LinkedIn](https://www.linkedin.com/in/robertcmayo/)
- Thomas Hales III | [GitHub](https://github.com/thalesIII) | [LinkedIn](https://www.linkedin.com/in/thomas-hales-35ab311a3/)
- Herman Chen | [GitHub](https://github.com/HermanChen4) | [LinkedIn](https://www.linkedin.com/in/herman-chen-839339240/)
- Christopher Jettoo | [GitHub](https://github.com/Christopher-Jettoo) | [LinkedIn](https://www.linkedin.com/in/christopher-j-1a240b169/)
