export const typeDefs = `#graphql
  scalar DateTime
  scalar JSON

  enum ModuleType {
    GLOBE
    AIRCRAFT
    SATELLITE
    MARITIME
    SIGINT
    GEOPHYSICAL
    FINANCIAL
    WEATHER
    BROADCAST
    SECURITY
  }

  enum AlertSeverity {
    INFO
    WARNING
    ERROR
    CRITICAL
  }

  enum AlertStatus {
    ACTIVE
    ACKNOWLEDGED
    RESOLVED
  }

  type Query {
    # Aircraft queries
    aircraftStates(bounds: BoundsInput): [Aircraft!]!
    aircraftByIcao(icao24: String!): Aircraft
    aircraftTrack(icao24: String!, time: Int): AircraftTrack
    
    # Satellite queries
    satellitesAbove(lat: Float!, lng: Float!, alt: Float, searchRadius: Int): [Satellite!]!
    satellitePositions(satid: Int!, lat: Float!, lng: Float!, alt: Float, seconds: Int): SatellitePositionResponse
    satelliteTle(satid: Int!): TLE
    
    # Weather queries
    currentWeather(lat: Float!, lng: Float!): Weather
    weatherForecast(lat: Float!, lng: Float!): Forecast
    
    # Earthquake queries
    earthquakes(timeRange: TimeRange!, minMagnitude: Float): [Earthquake!]!
    earthquakeById(id: String!): Earthquake
    
    # Crypto queries
    cryptoMarkets(vsCurrency: String, perPage: Int, page: Int): [Crypto!]!
    cryptoById(id: String!): CryptoDetail
    globalCryptoData: GlobalCryptoData
    
    # System queries
    systemStatus: SystemStatus!
    activeAlerts: [Alert!]!
  }

  type Mutation {
    # Alert mutations
    createAlert(input: CreateAlertInput!): Alert!
    acknowledgeAlert(id: String!): Alert!
    resolveAlert(id: String!): Alert!
    
    # User preferences
    updateUserPreferences(input: UserPreferencesInput!): UserPreferences!
  }

  type Subscription {
    aircraftUpdates: [Aircraft!]!
    satelliteUpdates: [Satellite!]!
    newAlerts: Alert!
    systemMetrics: SystemMetrics!
  }

  input BoundsInput {
    lamin: Float!
    lomin: Float!
    lamax: Float!
    lomax: Float!
  }

  input CreateAlertInput {
    title: String!
    message: String!
    type: ModuleType!
    severity: AlertSeverity!
    metadata: JSON
  }

  input UserPreferencesInput {
    defaultModule: ModuleType
    refreshInterval: Int
    alertNotifications: Boolean
    theme: String
  }

  type Aircraft {
    icao24: String!
    callsign: String
    originCountry: String
    timePosition: Int
    lastContact: Int
    longitude: Float
    latitude: Float
    baroAltitude: Float
    onGround: Boolean!
    velocity: Float
    trueTrack: Float
    verticalRate: Float
    geoAltitude: Float
    squawk: String
    spi: Boolean!
    positionSource: Int!
  }

  type AircraftTrack {
    icao24: String!
    callsign: String
    startTime: Int!
    endTime: Int!
    path: [[Float!]!]!
  }

  type Satellite {
    satid: Int!
    satname: String!
    intDesignator: String
    launchDate: String
    satlat: Float!
    satlng: Float!
    satalt: Float!
  }

  type SatellitePosition {
    satlatitude: Float!
    satlongitude: Float!
    sataltitude: Float!
    azimuth: Float!
    elevation: Float!
    ra: Float!
    dec: Float!
    timestamp: Int!
    eclipsed: Boolean!
  }

  type SatellitePositionResponse {
    info: SatelliteInfo!
    positions: [SatellitePosition!]!
  }

  type SatelliteInfo {
    satname: String!
    satid: Int!
    transactionscount: Int!
  }

  type TLE {
    satid: Int!
    satname: String!
    transactionscount: Int!
    tle: String!
  }

  type Weather {
    coord: Coordinates!
    weather: [WeatherCondition!]!
    main: WeatherMain!
    visibility: Int!
    wind: Wind!
    clouds: Clouds!
    dt: Int!
    sys: WeatherSys!
    timezone: Int!
    name: String!
  }

  type Coordinates {
    lon: Float!
    lat: Float!
  }

  type WeatherCondition {
    id: Int!
    main: String!
    description: String!
    icon: String!
  }

  type WeatherMain {
    temp: Float!
    feelsLike: Float!
    tempMin: Float!
    tempMax: Float!
    pressure: Int!
    humidity: Int!
    seaLevel: Int
    grndLevel: Int
  }

  type Wind {
    speed: Float!
    deg: Int!
    gust: Float
  }

  type Clouds {
    all: Int!
  }

  type WeatherSys {
    country: String!
    sunrise: Int!
    sunset: Int!
  }

  type Forecast {
    city: ForecastCity!
    list: [ForecastItem!]!
  }

  type ForecastCity {
    name: String!
    country: String!
    coord: Coordinates!
  }

  type ForecastItem {
    dt: Int!
    main: WeatherMain!
    weather: [WeatherCondition!]!
    wind: Wind!
    clouds: Clouds!
    pop: Float!
    dtTxt: String!
  }

  type Earthquake {
    id: String!
    magnitude: Float!
    place: String!
    time: DateTime!
    updated: DateTime!
    tz: Int
    url: String!
    felt: Int
    cdi: Float
    mmi: Float
    alert: String
    status: String!
    tsunami: Int!
    sig: Int!
    net: String!
    code: String!
    coordinates: [Float!]!
    depth: Float!
    magType: String!
    type: String!
    title: String!
  }

  type Crypto {
    id: String!
    symbol: String!
    name: String!
    image: String!
    currentPrice: Float!
    marketCap: Float!
    marketCapRank: Int!
    fullyDilutedValuation: Float
    totalVolume: Float!
    high24h: Float!
    low24h: Float!
    priceChange24h: Float!
    priceChangePercentage24h: Float!
    marketCapChange24h: Float!
    marketCapChangePercentage24h: Float!
    circulatingSupply: Float!
    totalSupply: Float
    maxSupply: Float
    ath: Float!
    athChangePercentage: Float!
    athDate: String!
    atl: Float!
    atlChangePercentage: Float!
    atlDate: String!
    lastUpdated: String!
  }

  type CryptoDetail {
    id: String!
    symbol: String!
    name: String!
    description: String!
    image: CryptoImages!
    marketCapRank: Int!
    marketData: CryptoMarketData!
  }

  type CryptoImages {
    thumb: String!
    small: String!
    large: String!
  }

  type CryptoMarketData {
    currentPrice: JSON!
    marketCap: JSON!
    totalVolume: JSON!
    priceChangePercentage24h: Float!
    priceChangePercentage7d: Float!
    priceChangePercentage30d: Float!
    circulatingSupply: Float!
    totalSupply: Float
    maxSupply: Float
  }

  type GlobalCryptoData {
    activeCryptocurrencies: Int!
    upcomingIcos: Int!
    ongoingIcos: Int!
    endedIcos: Int!
    markets: Int!
    totalMarketCap: JSON!
    totalVolume: JSON!
    marketCapPercentage: JSON!
    marketCapChangePercentage24hUsd: Float!
    updatedAt: DateTime!
  }

  type SystemStatus {
    status: String!
    timestamp: DateTime!
    version: String!
    uptime: Float!
    modules: [ModuleStatus!]!
  }

  type ModuleStatus {
    name: String!
    status: String!
    latency: Int!
    lastUpdate: DateTime!
  }

  type SystemMetrics {
    cpu: Float!
    memory: Float!
    disk: Float!
    network: Float!
    activeConnections: Int!
    requestsPerSecond: Float!
  }

  type Alert {
    id: String!
    title: String!
    message: String!
    type: ModuleType!
    severity: AlertSeverity!
    status: AlertStatus!
    metadata: JSON
    createdAt: DateTime!
    updatedAt: DateTime!
    acknowledgedBy: String
    resolvedBy: String
  }

  type UserPreferences {
    defaultModule: ModuleType
    refreshInterval: Int!
    alertNotifications: Boolean!
    theme: String!
  }

  enum TimeRange {
    HOUR
    DAY
    WEEK
    MONTH
  }
`;
