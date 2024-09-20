function getConfig() {

    console.log("Loading configuration for environment: ", process.env.VITE_APP_DEPLOY_ENV);
    const env = process.env.VITE_APP_DEPLOY_ENV || 'dev';
    console.log("Using environment: ", env);

    const commonConfig = {
        mapTilerApiKey: 'YEA1tZMNMgOy3erLlsIi',
    };

    const yamlConfig = __YAML_CONFIG__;
    const droneConnectionConfig = yamlConfig.DRONE_CONNECTION ? yamlConfig.DRONE_CONNECTION[env] : [];

    const envConfig = {
        dev: {
            // Development configuration
            fixedDroneList: ['2310-0003', '2310-0004', '2310-0005', '2310-0006'],
            testMode: true,
            uavWscUrl: 'http://10.128.4.200:20001',
            uavWscPath: '/TELEMETRY',
            adsbSioUrl: 'http://10.128.4.200:20013',
            adsbSioEvent: 'aircrafts_overview_data_update',
            adsbAreaOfInterestDataEvent: 'area_of_interest_data',
            AdsbSioNamespace: '',
            droneTagSioUrl: 'http://10.128.4.200:20013',
            droneTagSioEvent: 'dronetag_overview_data_update',
            droneTagSioNamespace: '',
            u_flight_plan_ip: '10.128.5.108',
            u_flight_plan_port: '20002',
            u_coreops_ui_ip: '10.128.4.200',
            u_coreops_ui_port: '8087',
            grafanaUrl: 'https://10.128.5.250:3000/',
            simulated_uavs_visible_default: true,
            uav_terminate_timeout: 5000,
            launchTimeOffset: 75,
            u_eagle_vision_data_api_url: 'http://10.128.4.200:20013/',
            minZoomLevelForAreaOfInterestADSB: 8,
            openaipApiKey: 'cf410794c7b27d2495f9d56babbad778',
            droneConnection: droneConnectionConfig,
            grpcWebProxyUrl: 'http://10.128.4.200:8089/',
        },
        prod: {
            // Production configuration
            fixedDroneList: ['2308-0001', '2308-0002', '2405-0003', '2405-0004'],
            testMode: false,
            uavWscUrl: 'http://10.128.0.239:20001',
            uavWscPath: '/TELEMETRY',
            adsbSioUrl: 'http://10.128.6.224:20013',
            adsbSioEvent: 'aircrafts_overview_data_update',
            adsbAreaOfInterestDataEvent: 'area_of_interest_data',
            AdsbSioNamespace: '',
            droneTagSioUrl: 'http://10.128.6.224:20013',
            droneTagSioEvent: 'dronetag_overview_data_update',
            droneTagSioNamespace: '',
            u_flight_plan_ip: '10.128.0.239',
            u_flight_plan_port: '20002',
            u_coreops_ui_ip: '10.128.0.239',
            u_coreops_ui_port: '8087',
            grafanaUrl: 'https://10.128.6.144:3000/',
            simulated_uavs_visible_default: true,
            uav_terminate_timeout: 5000,
            launchTimeOffset: 75,
            u_eagle_vision_data_api_url: 'http://10.128.6.224:20013/',
            minZoomLevelForAreaOfInterestADSB: 8,
            openaipApiKey: 'cf410794c7b27d2495f9d56babbad778',
            droneConnection: droneConnectionConfig,
            grpcWebProxyUrl: 'http://10.128.6.224:8089/',
        }
    };

    console.log("Configuration: ", envConfig[env]);
    console.log("YAML Configuration: ", yamlConfig);

    // Merge common configuration with environment-specific configuration and YAML configuration
    return { ...commonConfig, ...envConfig[env] };
}

// Export the configuration
const config = getConfig();

export default config;
