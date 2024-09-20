function getConfig() {

    // console.log("Loading configuration for environment: ", process.env.VITE_APP_DEPLOY_ENV);
    // const env = process.env.VITE_APP_DEPLOY_ENV || 'dev';
    // console.log("Using environment: ", env);

    const commonConfig = {
        mapTilerApiKey: 'YEA1tZMNMgOy3erLlsIi',
        openaipApiKey: 'cf410794c7b27d2495f9d56babbad778',
    };

    // const yamlConfig = __YAML_CONFIG__;
    // const droneConnectionConfig = yamlConfig.DRONE_CONNECTION ? yamlConfig.DRONE_CONNECTION[env] : [];

    // const envConfig = {
    //     dev: {
    //         // Development configuration
    //         // fixedDroneList: ['2310-0003', '2310-0004', '2310-0005', '2310-0006'],
    //     },
    //     prod: {
    //         // Production configuration
    //         // fixedDroneList: ['2308-0001', '2308-0002', '2405-0003', '2405-0004'],

    //     }
    // };

    // console.log("Configuration: ", envConfig[env]);
    // console.log("YAML Configuration: ", yamlConfig);

    // // Merge common configuration with environment-specific configuration and YAML configuration
    return { ...commonConfig};
}

// Export the configuration
const config = getConfig();

export default config;
