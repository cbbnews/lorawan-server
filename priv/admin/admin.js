/*
 * Copyright (c) 2016-2017 Petr Gotthard <petr.gotthard@centrum.cz>
 * All rights reserved.
 * Distributed under the terms of the MIT License. See the LICENSE file.
 */
var myApp = angular.module('myApp', ['ng-admin', 'uiGmapgoogle-maps', 'googlechart']);
myApp.config(['NgAdminConfigurationProvider', function (nga) {
    var admin = nga.application('Server Admin').baseApiUrl('/');

    var applications = nga.entity('applications')
        .identifier(nga.field('name'));
    var users = nga.entity('users')
        .identifier(nga.field('name'));
    var gateways = nga.entity('gateways')
        .identifier(nga.field('mac'));
    var multicast_channels = nga.entity('multicast_channels')
        .identifier(nga.field('devaddr'));
    var devices = nga.entity('devices')
        .identifier(nga.field('deveui'));
    var nodes = nga.entity('nodes')
        .identifier(nga.field('devaddr'));
    var ignored_nodes = nga.entity('ignored_nodes')
        .identifier(nga.field('devaddr'));
    var txframes = nga.entity('txframes')
        .identifier(nga.field('frid'));
    var rxframes = nga.entity('rxframes')
        .identifier(nga.field('frid'))
        .readOnly();
    var connectors = nga.entity('connectors')
        .identifier(nga.field('connid'));
    var handlers = nga.entity('handlers')
        .identifier(nga.field('appid'));
    var events = nga.entity('events')
        .identifier(nga.field('evid'));

    adr_choices = [
        { value: 0, label: 'OFF' },
        { value: 1, label: 'ON' },
        { value: 2, label: 'Manual' },
    ];

    fcnt_choices = [
        { value: 0, label: 'Strict 16-bit' },
        { value: 1, label: 'Strict 32-bit' },
        { value: 2, label: 'Reset on zero' },
        { value: 3, label: 'Disabled' }
    ];

    region_choices = [
        { value: 'EU863-870', label: 'EU 863-870MHz' },
        { value: 'US902-928', label: 'US 902-928MHz' },
        { value: 'US902-928-PR', label: 'US 902-928MHz (Hybrid)' },
        { value: 'CN779-787', label: 'China 779-787MHz' },
        { value: 'EU433', label: 'EU 433MHz' },
        { value: 'AU915-928', label: 'Australia 915-928MHz' },
        { value: 'CN470-510', label: 'China 470-510MHz' },
        { value: 'KR920-923', label: 'South Korea 920-923MHz' }
    ];

    data_rate_choices = [
        { value: 0, label: 'SF12 125 kHz (250 bit/s)', regions: ['EU863-870', 'CN779-787', 'EU433', 'CN470-510', 'KR920-923'] },
        { value: 1, label: 'SF11 125 kHz (440 bit/s)', regions: ['EU863-870', 'CN779-787', 'EU433', 'CN470-510', 'KR920-923'] },
        { value: 2, label: 'SF10 125 kHz (980 bit/s)', regions: ['EU863-870', 'CN779-787', 'EU433', 'CN470-510', 'KR920-923'] },
        { value: 3, label: 'SF9 125 kHz (1760 bit/s)', regions: ['EU863-870', 'CN779-787', 'EU433', 'CN470-510', 'KR920-923'] },
        { value: 4, label: 'SF8 125 kHz (3125 bit/s)', regions: ['EU863-870', 'CN779-787', 'EU433', 'CN470-510', 'KR920-923'] },
        { value: 5, label: 'SF7 125 kHz (5470 bit/s)', regions: ['EU863-870', 'CN779-787', 'EU433', 'CN470-510', 'KR920-923'] },
        { value: 6, label: 'SF7 250 kHz (11000 bit/s)', regions: ['EU863-870', 'CN779-787', 'EU433'] },

        { value: 0, label: 'SF10 125 kHz (980 bit/s)', regions: ['US902-928', 'US902-928-PR', 'AU915-928'] },
        { value: 1, label: 'SF9 125 kHz (1760 bit/s)', regions: ['US902-928', 'US902-928-PR', 'AU915-928'] },
        { value: 2, label: 'SF8 125 kHz (3125 bit/s)', regions: ['US902-928', 'US902-928-PR', 'AU915-928'] },
        { value: 3, label: 'SF7 125 kHz (5470 bit/s)', regions: ['US902-928', 'US902-928-PR', 'AU915-928'] },
        { value: 4, label: 'SF8 500 kHz (12500 bit/s)', regions: ['US902-928', 'US902-928-PR', 'AU915-928'] }
    ];

    coding_rate_choices = [
        { value: '4/5', label: '4/5 (1.25)' },
        { value: '4/6', label: '4/6 (1.5)' },
        { value: '4/7', label: '4/7 (1.75)' },
        { value: '4/8', label: '4/8 (2.0)' }
    ];

    power_choices = [
        { value: 0, label: '20 dBm', regions: ['EU863-870'] },
        { value: 1, label: '14 dBm', regions: ['EU863-870'] },
        { value: 2, label: '11 dBm', regions: ['EU863-870'] },
        { value: 3, label: '8 dBm', regions: ['EU863-870'] },
        { value: 4, label: '5 dBm', regions: ['EU863-870'] },
        { value: 5, label: '2 dBm', regions: ['EU863-870'] },

        { value: 0, label: '30 dBm', regions: ['US902-928', 'US902-928-PR', 'AU915-928'] },
        { value: 1, label: '28 dBm', regions: ['US902-928', 'US902-928-PR', 'AU915-928'] },
        { value: 2, label: '26 dBm', regions: ['US902-928', 'US902-928-PR', 'AU915-928'] },
        { value: 3, label: '24 dBm', regions: ['US902-928', 'US902-928-PR', 'AU915-928'] },
        { value: 4, label: '22 dBm', regions: ['US902-928', 'US902-928-PR', 'AU915-928'] },
        { value: 5, label: '20 dBm', regions: ['US902-928', 'US902-928-PR', 'AU915-928'] },
        { value: 6, label: '18 dBm', regions: ['US902-928', 'US902-928-PR', 'AU915-928'] },
        { value: 7, label: '16 dBm', regions: ['US902-928', 'US902-928-PR', 'AU915-928'] },
        { value: 8, label: '14 dBm', regions: ['US902-928', 'US902-928-PR', 'AU915-928'] },
        { value: 9, label: '12 dBm', regions: ['US902-928', 'US902-928-PR', 'AU915-928'] },
        { value: 10, label: '10 dBm', regions: ['US902-928', 'US902-928-PR', 'AU915-928'] },

        { value: 0, label: '10 dBm', regions: ['CN779-787', 'EU433'] },
        { value: 1, label: '7 dBm', regions: ['CN779-787', 'EU433'] },
        { value: 2, label: '4 dBm', regions: ['CN779-787', 'EU433'] },
        { value: 3, label: '1 dBm', regions: ['CN779-787', 'EU433'] },
        { value: 4, label: '-2 dBm', regions: ['CN779-787', 'EU433'] },
        { value: 5, label: '-5 dBm', regions: ['CN779-787', 'EU433'] },

        { value: 0, label: '17 dBm', regions: ['CN470-510'] },
        { value: 1, label: '16 dBm', regions: ['CN470-510'] },
        { value: 2, label: '14 dBm', regions: ['CN470-510'] },
        { value: 3, label: '12 dBm', regions: ['CN470-510'] },
        { value: 4, label: '10 dBm', regions: ['CN470-510'] },
        { value: 5, label: '7 dBm', regions: ['CN470-510'] },
        { value: 6, label: '5 dBm', regions: ['CN470-510'] },
        { value: 7, label: '2 dBm', regions: ['CN470-510'] },

        { value: 0, label: '20 dBm', regions: ['KR920-923'] },
        { value: 1, label: '14 dBm', regions: ['KR920-923'] },
        { value: 2, label: '10 dBm', regions: ['KR920-923'] },
        { value: 3, label: '8 dBm', regions: ['KR920-923'] },
        { value: 4, label: '5 dBm', regions: ['KR920-923'] },
        { value: 5, label: '2 dBm', regions: ['KR920-923'] },
        { value: 6, label: '0 dBm', regions: ['KR920-923'] }
    ];

    format_choices = [
        { value: 'raw', label: 'Raw Data' },
        { value: 'json', label: 'JSON' }
    ];

    // ---- users
    users.listView().fields([
        nga.field('name').isDetailLink(true)
    ]);
    users.creationView().fields([
        nga.field('name'),
        nga.field('pass', 'password')
    ]);
    users.editionView().fields(users.creationView().fields());
    // add to the admin application
    admin.addEntity(users);

    // ---- gateways
    gateways.listView().fields([
        nga.field('mac').label('MAC').isDetailLink(true),
        nga.field('netid').label('NetID'),
        nga.field('subid').label('SubID')
            .map(format_bitstring),
        nga.field('desc').label('Description'),
        nga.field('last_rx', 'datetime').label('Last RX'),
        nga.field('alive', 'boolean').label('Alive')
            .map(function timediff(value, entry) {
                return timeyoung(entry.last_rx, 60);
            })
    ])
    .sortField('mac')
    .sortDir('ASC');

    gateways.creationView().fields([
        nga.field('mac').label('MAC')
            .attributes({ placeholder: 'e.g. 0123456789ABCDEF' })
            .transform(function strip(value, entry) {
                return value.replace(/[-:]/g, '')
            })
            .validation({ required: true, pattern: '[A-Fa-f0-9]{2}([-:]?[A-Fa-f0-9]{2}){7}' }),
        nga.field('netid').label('NetID')
            .attributes({ placeholder: 'e.g. 0123AB' })
            .validation({ required: true, pattern: '[A-Fa-f0-9]{6}' }),
        nga.field('subid').label('SubID')
            .map(format_bitstring)
            .transform(parse_bitstring)
            .attributes({ placeholder: 'e.g. 0:3' })
            .validation({ pattern: '([A-Fa-f0-9]{2})*:[0-9]+' }),
        nga.field('tx_rfch', 'number').label('TX Chain')
            .attributes({ placeholder: 'e.g. 0' })
            .validation({ required: true })
            .defaultValue(0),
        nga.field('tx_powe', 'number').label('TX Power (dBm)')
            .attributes({ placeholder: 'e.g. 14' }),
        nga.field('ant_gain', 'number').label('Antenna Gain (dBi)')
            .attributes({ placeholder: 'e.g. 6' }),
        nga.field('desc').label('Description'),
        nga.field('last_rx', 'datetime').label('Last RX'),
        nga.field('gpspos', 'template')
            .validation({required: true })
            .label('Location')
            .template('<map location="value"></map>'),
        nga.field('gpsalt', 'number').label('Altitude')
    ]);
    gateways.editionView().fields(gateways.creationView().fields());
    // add to the admin application
    admin.addEntity(gateways);

    // ---- multicast_channels
    multicast_channels.listView().title('Multicast Channels');
    multicast_channels.listView().fields([
        nga.field('devaddr').label('DevAddr').isDetailLink(true),
        nga.field('region'),
        nga.field('app').label('Application'),
        nga.field('appid').label('Group'),
        nga.field('chan', 'number').label('Channel'),
        nga.field('datr', 'choice').label('Data rate')
            .choices(function(entry) {
                return data_rate_choices.filter(function(item) {
                    return item.regions.indexOf(entry.values.region) >= 0
                });
            }),
        nga.field('codr', 'choice').label('Coding rate')
            .choices(coding_rate_choices),
        nga.field('fcntdown', 'number').label('FCnt Down')
    ])
    .sortField('devaddr')
    .sortDir('ASC');

    multicast_channels.creationView().fields([
        nga.field('devaddr').label('DevAddr')
            .attributes({ placeholder: 'e.g. ABC12345' })
            .validation({ required: true, pattern: '[A-Fa-f0-9]{8}' }),
        nga.field('region', 'choice')
            .choices(region_choices)
            .validation({ required: true }),
        nga.field('app', 'reference').label('Application')
            .targetEntity(applications)
            .targetField(nga.field('name'))
            .validation({ required: true }),
        nga.field('appid').label('Group'),
        nga.field('chan', 'number').label('Channel')
            .validation({ required: true }),
        nga.field('datr', 'choice').label('Data rate')
            .validation({ required: true })
            .choices(function(entry) {
                return data_rate_choices.filter(function(item) {
                    return item.regions.indexOf(entry.values.region) >= 0
                });
            }),
        nga.field('codr', 'choice').label('Coding rate')
            .choices(coding_rate_choices)
            .validation({ required: true }),
        nga.field('nwkskey').label('NwkSKey')
            .attributes({ placeholder: 'e.g. FEDCBA9876543210FEDCBA9876543210' })
            .validation({ required: true, pattern: '[A-Fa-f0-9]{32}' }),
        nga.field('appskey').label('AppSKey')
            .attributes({ placeholder: 'e.g. FEDCBA9876543210FEDCBA9876543210' })
            .validation({ required: true, pattern: '[A-Fa-f0-9]{32}' }),
        nga.field('mac', 'reference').label('Gateway')
            .targetEntity(gateways)
            .targetField(nga.field('mac'))
            .validation({ required: true }),
        nga.field('fcntdown', 'number').label('FCnt Down')
            .defaultValue(0)
            .validation({ required: true })
    ]);
    multicast_channels.editionView().fields(multicast_channels.creationView().fields());
    // add to the admin application
    admin.addEntity(multicast_channels);

    // ---- devices
    devices.listView().fields([
        nga.field('deveui').label('DevEUI').isDetailLink(true),
        nga.field('region'),
        nga.field('app').label('Application'),
        nga.field('appid').label('Group'),
        nga.field('appargs').label('Arguments'),
        nga.field('last_join', 'datetime').label('Last Join'),
        nga.field('link', 'reference').label('Node')
            .targetEntity(nodes)
            .targetField(nga.field('devaddr'))
    ])
    .sortField('deveui')
    .sortDir('ASC');
    devices.listView().filters([
        nga.field('app').label('Application'),
        nga.field('appid').label('Group')
    ]);

    devices.creationView().fields([
        nga.field('deveui').label('DevEUI')
            .attributes({ placeholder: 'e.g. 0123456789ABCDEF' })
            .validation({ required: true, pattern: '[A-Fa-f0-9]{16}' }),
        nga.field('region', 'choice')
            .choices(region_choices)
            .validation({ required: true }),
        nga.field('app', 'reference').label('Application')
            .targetEntity(applications)
            .targetField(nga.field('name'))
            .validation({ required: true }),
        nga.field('appid').label('Group'),
        nga.field('appargs').label('Arguments'),
        nga.field('appeui').label('AppEUI')
            .attributes({ placeholder: 'e.g. 0123456789ABCDEF' })
            .validation({ required: true, pattern: '[A-Fa-f0-9]{16}' }),
        nga.field('appkey').label('AppKey')
            .attributes({ placeholder: 'e.g. FEDCBA9876543210FEDCBA9876543210' })
            .validation({ required: true, pattern: '[A-Fa-f0-9]{32}' }),
        nga.field('fcnt_check', 'choice').label('FCnt Check')
            .choices(fcnt_choices)
            .defaultValue(0), // Strict 16-bit
        nga.field('can_join', 'boolean').label('Can Join?')
            .defaultValue(true),
        nga.field('last_join', 'datetime').label('Last Join'),
        nga.field('link').label('Node')
            .attributes({ placeholder: 'e.g. ABC12345' })
            .validation({ pattern: '[A-Fa-f0-9]{8}' }),
        nga.field('adr_flag_set', 'choice').label('Set ADR')
            .choices(adr_choices)
            .defaultValue(1),
        nga.field('adr_set.power', 'choice').label('Set power')
            .choices(function(entry) {
                return power_choices.filter(function(item) {
                    return item.regions.indexOf(entry.values.region) >= 0
                });
            }),
        nga.field('adr_set.datr', 'choice').label('Set data rate')
            .choices(function(entry) {
                return data_rate_choices.filter(function(item) {
                    return item.regions.indexOf(entry.values.region) >= 0
                });
            }),
        nga.field('adr_set.chans').label('Set channels')
            .attributes({ placeholder: 'e.g. 0-2' })
            .validation({ pattern: '[0-9]+(-[0-9]+)?(,[ ]*[0-9]+(-[0-9]+)?)*' }),
        nga.field('rxwin_set.rx1_dr_offset', 'number').label('Set RX1 DR offset')
    ]);
    devices.creationView().template(createWithTabsTemplate([
        {name:"General", min:0, max:11},
        {name:"ADR", min:11, max:16}
    ]));
    devices.editionView().fields(devices.creationView().fields());
    devices.editionView().template(editWithTabsTemplate([
        {name:"General", min:0, max:11},
        {name:"ADR", min:11, max:16}
    ]));
    // add to the admin application
    admin.addEntity(devices);

    // ---- nodes
    nodes.listView().fields([
        nga.field('devaddr').label('DevAddr').isDetailLink(true),
        nga.field('region'),
        nga.field('app').label('Application'),
        nga.field('appid').label('Group'),
        nga.field('appargs').label('Arguments'),
        nga.field('fcntup', 'number').label('FCnt Up'),
        nga.field('fcntdown', 'number').label('FCnt Down'),
        nga.field('devstat.battery', 'number').label('Battery'),
        nga.field('devstat.margin', 'number').label('SNR (dB)'),
        nga.field('last_rx', 'datetime').label('Last RX')
    ])
    .sortField('devaddr')
    .sortDir('ASC');
    nodes.listView().filters([
        nga.field('app').label('Application'),
        nga.field('appid').label('Group')
    ]);

    nodes.creationView().fields([
        // General
        nga.field('devaddr').label('DevAddr')
            .attributes({ placeholder: 'e.g. ABC12345' })
            .validation({ required: true, pattern: '[A-Fa-f0-9]{8}' }),
        nga.field('region', 'choice')
            .choices(region_choices)
            .validation({ required: true }),
        nga.field('app', 'reference').label('Application')
            .targetEntity(applications)
            .targetField(nga.field('name'))
            .validation({ required: true }),
        nga.field('appid').label('Group'),
        nga.field('appargs').label('Arguments'),
        nga.field('nwkskey').label('NwkSKey')
            .attributes({ placeholder: 'e.g. FEDCBA9876543210FEDCBA9876543210' })
            .validation({ required: true, pattern: '[A-Fa-f0-9]{32}' }),
        nga.field('appskey').label('AppSKey')
            .attributes({ placeholder: 'e.g. FEDCBA9876543210FEDCBA9876543210' })
            .validation({ required: true, pattern: '[A-Fa-f0-9]{32}' }),
        nga.field('fcntup', 'number').label('FCnt Up')
            .defaultValue(0)
            .validation({ required: true }),
        nga.field('fcntdown', 'number').label('FCnt Down')
            .defaultValue(0)
            .validation({ required: true }),
        nga.field('fcnt_check', 'choice').label('FCnt Check')
            .choices(fcnt_choices)
            .defaultValue(0), // Strict 16-bit
        nga.field('last_reset', 'datetime').label('Last Reset'),
        nga.field('last_rx', 'datetime').label('Last RX'),
        nga.field('last_mac', 'reference').label('Gateway')
            .targetEntity(gateways)
            .targetField(nga.field('mac')),
        // ADR
        nga.field('adr_flag_set', 'choice').label('Set ADR')
            .choices(adr_choices)
            .defaultValue(1), // ON
        nga.field('adr_set.power', 'choice').label('Set power')
            .choices(function(entry) {
                return power_choices.filter(function(item) {
                    return item.regions.indexOf(entry.values.region) >= 0
                });
            }),
        nga.field('adr_set.datr', 'choice').label('Set data rate')
            .choices(function(entry) {
                return data_rate_choices.filter(function(item) {
                    return item.regions.indexOf(entry.values.region) >= 0
                });
            }),
        nga.field('adr_set.chans').label('Set channels')
            .attributes({ placeholder: 'e.g. 0-2' })
            .validation({ pattern: '[0-9]+(-[0-9]+)?(,[ ]*[0-9]+(-[0-9]+)?)*' }),
        nga.field('rxwin_set.rx1_dr_offset', 'number').label('Set RX1 DR offset')
    ]);
    nodes.creationView().template(createWithTabsTemplate([
        {name:"General", min:0, max:13},
        {name:"ADR", min:13, max:18}
    ]));

    nodes.editionView().fields([
        // General
        nga.field('devaddr').label('DevAddr')
            .attributes({ placeholder: 'e.g. ABC12345' })
            .validation({ required: true, pattern: '[A-Fa-f0-9]{8}' }),
        nga.field('region', 'choice')
            .choices(region_choices)
            .validation({ required: true }),
        nga.field('app', 'reference').label('Application')
            .targetEntity(applications)
            .targetField(nga.field('name'))
            .validation({ required: true }),
        nga.field('appid').label('Group'),
        nga.field('appargs').label('Arguments'),
        nga.field('nwkskey').label('NwkSKey')
            .attributes({ placeholder: 'e.g. FEDCBA9876543210FEDCBA9876543210' })
            .validation({ required: true, pattern: '[A-Fa-f0-9]{32}' }),
        nga.field('appskey').label('AppSKey')
            .attributes({ placeholder: 'e.g. FEDCBA9876543210FEDCBA9876543210' })
            .validation({ required: true, pattern: '[A-Fa-f0-9]{32}' }),
        nga.field('fcntup', 'number').label('FCnt Up')
            .defaultValue(0)
            .validation({ required: true }),
        nga.field('fcntdown', 'number').label('FCnt Down')
            .defaultValue(0)
            .validation({ required: true }),
        nga.field('fcnt_check', 'choice').label('FCnt Check')
            .choices(fcnt_choices)
            .defaultValue(0), // Strict 16-bit
        nga.field('last_reset', 'datetime').label('Last Reset'),
        nga.field('last_rx', 'datetime').label('Last RX'),
        nga.field('last_mac', 'reference').label('Gateway')
            .targetEntity(gateways)
            .targetField(nga.field('mac')),
        nga.field('downlinks', 'referenced_list')
            .targetEntity(txframes)
            .targetReferenceField('devaddr')
            .targetFields([
                nga.field('datetime', 'datetime').label('Creation Time'),
                nga.field('txdata.port'),
                nga.field('txdata.data')
            ])
            .listActions(['delete']),
        // ADR
        nga.field('adr_flag_set', 'choice').label('Set ADR')
            .choices(adr_choices)
            .defaultValue(1), // ON
        nga.field('adr_set.power', 'choice').label('Set power')
            .choices(function(entry) {
                return power_choices.filter(function(item) {
                    return item.regions.indexOf(entry.values.region) >= 0
                });
            }),
        nga.field('adr_set.datr', 'choice').label('Set data rate')
            .choices(function(entry) {
                return data_rate_choices.filter(function(item) {
                    return item.regions.indexOf(entry.values.region) >= 0
                });
            }),
        nga.field('adr_set.chans').label('Set channels')
            .attributes({ placeholder: 'e.g. 0-2' })
            .validation({ pattern: '[0-9]+(-[0-9]+)?(,[ ]*[0-9]+(-[0-9]+)?)*' }),
        nga.field('rxwin_set.rx1_dr_offset', 'number').label('Set RX1 DR offset'),
        nga.field('adr_flag_use', 'choice').label('Used ADR')
            .choices(adr_choices)
            .editable(false),
        nga.field('adr_use.chans').label('Used channels')
            .editable(false),
        nga.field('rxwin_use.rx1_dr_offset', 'number').label('Used RX1 DR offset')
            .editable(false),
        nga.field('devaddr', 'template').label('RX')
            .template('<rgraph value="value"></rgraph>'),
        nga.field('devaddr', 'template').label('RX Quality')
            .template('<qgraph value="value"></qgraph>'),
        // Status
        nga.field('devstat.battery', 'number').label('Battery'),
        nga.field('devstat.margin', 'number').label('SNR (dB)'),
        nga.field('devstat_time', 'datetime').label('Status Time'),
        nga.field('devstat_fcnt', 'number').label('Status FCnt'),
        nga.field('devaddr', 'template').label('Device Status')
            .template('<dgraph value="value"></dgraph>')
    ]);
    nodes.editionView().template(editWithTabsTemplate([
        {name:"General", min:0, max:14},
        {name:"ADR", min:14, max:24},
        {name:"Status", min:24, max:29}
    ]));
    // add to the admin application
    admin.addEntity(nodes);
    admin.addEntity(txframes);

    // ---- ignored nodes
    ignored_nodes.listView().fields([
        nga.field('devaddr').label('DevAddr').isDetailLink(true),
        nga.field('mask')
    ])
    .sortField('devaddr')
    .sortDir('ASC');

    ignored_nodes.creationView().fields([
        nga.field('devaddr').label('DevAddr')
            .attributes({ placeholder: 'e.g. ABC12345' })
            .validation({ required: true, pattern: '[A-Fa-f0-9]{8}' }),
        nga.field('mask')
            .attributes({ placeholder: 'e.g. FFFFFFFF' })
            .validation({ pattern: '[A-Fa-f0-9]{8}' })
    ]);
    ignored_nodes.editionView().fields(ignored_nodes.creationView().fields());
    // add to the admin application
    admin.addEntity(ignored_nodes);

    // ---- rxframes
    rxframes.listView().title('Received Frames')
        .batchActions([]);
    rxframes.listView().fields([
        nga.field('datetime', 'datetime').label('Received'),
        nga.field('mac', 'reference').label('MAC')
            .targetEntity(gateways)
            .targetField(nga.field('mac')),
        nga.field('devaddr', 'reference').label('DevAddr')
            .targetEntity(nodes)
            .targetField(nga.field('devaddr')),
        nga.field('app').label('Application'),
        nga.field('appid').label('Group'),
        nga.field('rxq.lsnr').label('SNR'),
        nga.field('fcnt', 'number').label('FCnt'),
        nga.field('port', 'number'),
        nga.field('data')
            .template(function(entry){
                return "<div title='[ASCII] " + hextoascii(entry.values.data) + "'>" + entry.values.data + "</div>"
            })
    ])
    .sortField('datetime');
    rxframes.listView().filters([
        nga.field('mac', 'reference').label('MAC')
            .targetEntity(gateways)
            .targetField(nga.field('mac')),
        nga.field('devaddr').label('DevAddr'),
        nga.field('app').label('Application'),
        nga.field('appid').label('Group')
    ]);
    // add to the admin application
    admin.addEntity(rxframes);

    // ---- connectors
    connectors.listView().fields([
        nga.field('connid').label('Name').isDetailLink(true),
        nga.field('enabled', 'boolean'),
        nga.field('uri').label('URI'),
        nga.field('published').label('Published Topic'),
        nga.field('subscribe').label('Subscribe'),
        nga.field('consumed').label('Consumed Topic')
    ]);
    connectors.creationView().fields([
        nga.field('connid').label('Connector Name')
            .validation({ required: true }),
        nga.field('enabled', 'boolean')
            .validation({ required: true }),
        nga.field('uri').label('URI')
            .attributes({ placeholder: 'e.g. mqtt://server:8883' })
            .validation({ required: true, pattern: '^(mqtt)s?:\/\/[^\/?#]+[^?#]*' }),
        nga.field('published').label('Published Topic'),
        nga.field('subscribe').label('Subscribe'),
        nga.field('consumed').label('Consumed Topic'),
        nga.field('client_id').label('Client ID'),
        nga.field('auth', 'choice')
            .choices([
                { value: 'normal', label: 'Username+Password' },
                { value: 'sas', label: 'Shared Access Signature' }
            ]),
        nga.field('name'),
        nga.field('pass').label('Password/Key'),
        nga.field('certfile', 'file').label('User Certificate')
            .uploadInformation({'url': 'upload'}),
        nga.field('keyfile', 'file').label('Private Key')
            .uploadInformation({'url': 'upload'})
    ]);
    connectors.creationView().template(createWithTabsTemplate([
        {name:"General", min:0, max:6},
        {name:"Authentication", min:6, max:12}
    ]));
    connectors.editionView().fields(connectors.creationView().fields());
    connectors.editionView().template(editWithTabsTemplate([
        {name:"General", min:0, max:6},
        {name:"Authentication", min:6, max:12}
    ]));
    // add to the admin application
    admin.addEntity(connectors);

    // ---- handlers
    handlers.listView().fields([
        nga.field('appid').label('Group').isDetailLink(true),
        nga.field('format', 'choice')
            .choices(format_choices),
        nga.field('connid').label('Connector')
    ]);
    handlers.creationView().fields([
        nga.field('appid').label('Group')
            .validation({ required: true }),
        nga.field('format', 'choice')
            .choices(format_choices),
        nga.field('parse', 'text').label('Parse Uplink'),
        nga.field('build', 'text').label('Build Downlink'),
        nga.field('connid', 'reference').label('Connector')
            .targetEntity(connectors)
            .targetField(nga.field('connid'))
    ]);
    handlers.editionView().fields(handlers.creationView().fields());
    // add to the admin application
    admin.addEntity(handlers);

    // ---- events
    events.listView().fields([
        nga.field('severity'),
        nga.field('first_rx', 'datetime').label('First Occurred'),
        nga.field('last_rx', 'datetime').label('Last Occurred'),
        nga.field('count', 'number'),
        nga.field('entity'),
        nga.field('eid')
            .template(function(entry){
                if (entry.values.eid != null) {
                    return "<a href='admin/#" + entry.values.entity + "s/edit/" + entry.values.eid + "'>" +
                        entry.values.eid + "</a>";
                }
            }),
        nga.field('text', 'wysiwyg')
    ])
    .sortField('last_rx');
    events.listView().filters([
        nga.field('severity', 'choice')
            .choices([
                { value: 'error', label: 'error' },
                { value: 'warning', label: 'warning' },
                { value: 'info', label: 'info' }
            ]),
        nga.field('entity', 'choice')
            .choices([
                { value: 'server', label: 'server' },
                { value: 'gateway', label: 'gateway' },
                { value: 'device', label: 'device' },
                { value: 'node', label: 'node' }
            ]),
        nga.field('eid')
    ]);
    // add to the admin application
    admin.addEntity(events);

    // ---- menu
    admin.menu(nga.menu()
        .addChild(nga.menu(users).icon('<span class="fa fa-user fa-fw"></span>'))
        .addChild(nga.menu().title('Infrastructure').icon('<span class="fa fa-sitemap fa-fw"></span>')
            .addChild(nga.menu(gateways).icon('<span class="fa fa-cloud fa-fw"></span>'))
            .addChild(nga.menu(multicast_channels).icon('<span class="fa fa-bullhorn fa-fw"></span>'))
            .addChild(nga.menu(ignored_nodes).icon('<span class="fa fa-ban fa-fw"></span>'))
        )
        .addChild(nga.menu(devices).icon('<span class="fa fa-cube fa-fw"></span>'))
        .addChild(nga.menu(nodes).icon('<span class="fa fa-rss fa-fw"></span>'))
        .addChild(nga.menu().title('Backends').icon('<span class="fa fa-industry fa-fw"></span>')
          .addChild(nga.menu(handlers).icon('<span class="fa fa-cogs fa-fw"></span>'))
          .addChild(nga.menu(connectors).icon('<span class="fa fa-bolt fa-fw"></span>'))
        )
        .addChild(nga.menu(rxframes).title('Received Frames').icon('<span class="fa fa-comments fa-fw"></span>'))
        .autoClose(false)
    );

    // ---- dashboard
    admin.dashboard(nga.dashboard()
        .addCollection(nga.collection(gateways)
            .fields([
                nga.field('mac').label('MAC').isDetailLink(true),
                nga.field('netid').label('NetID'),
                nga.field('subid').label('SubID')
                    .map(format_bitstring),
                nga.field('last_rx', 'datetime').label('Last RX'),
                nga.field('alive', 'boolean').label('Alive')
                    .map(function timediff(value, entry) {
                        return timeyoung(entry.last_rx, 60);
                    })
            ])
            .sortField('mac')
            .sortDir('ASC')
            .perPage(7)
        )
        .addCollection(nga.collection(events)
            .fields([
                nga.field('last_rx', 'datetime').label('Last Occurred'),
                nga.field('entity'),
                nga.field('eid')
                    .template(function(entry){
                        if (entry.values.eid != null) {
                            return "<a href='admin/#" + entry.values.entity + "s/edit/" + entry.values.eid + "'>" +
                                entry.values.eid + "</a>";
                        }
                    }),
                nga.field('text', 'wysiwyg')
            ])
            .sortField('last_rx')
            .perPage(7)
        )
        .addCollection(nga.collection(devices)
            .fields([
                nga.field('deveui').label('DevEUI').isDetailLink(true),
                nga.field('last_join', 'datetime').label('Last Join')
            ])
            .sortField('deveui')
            .sortDir('ASC')
            .perPage(7)
        )
        .addCollection(nga.collection(rxframes).title('Received Frames')
            .fields([
                nga.field('datetime', 'datetime').label('Received'),
                nga.field('mac', 'reference').label('MAC')
                    .targetEntity(gateways)
                    .targetField(nga.field('mac')),
                nga.field('devaddr', 'reference').label('DevAddr')
                    .targetEntity(nodes)
                    .targetField(nga.field('devaddr')),
                nga.field('rxq.lsnr').label('SNR')
            ])
            .sortField('datetime')
            .perPage(7)
        )
        .addCollection(nga.collection(nodes)
            .fields([
                nga.field('devaddr').label('DevAddr').isDetailLink(true),
                nga.field('devstat.battery', 'number').label('Battery'),
                nga.field('last_rx', 'datetime').label('Last RX')
            ])
            .sortField('devaddr')
            .sortDir('ASC')
            .perPage(7)
        )
    );

    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}]);

function timeyoung(value, deltas) {
    var x1 = new Date();
    var x2 = new Date(value);
    return x1.getTime() - x2.getTime() < deltas*1000;
}

function hextoascii(val) {
    var hex  = val.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
        var char = parseInt(hex.substr(n, 2), 16);
        if(char >= 0x20 && char <= 0x7E)
            str += String.fromCharCode(char);
        else
            str += '.';
    }
    return str;
}

function format_bitstring(value, entry) {
    if(entry["subid.val"] != null)
        return entry["subid.val"] + ":" + entry["subid.len"];
    else
        return null;
}
function parse_bitstring(value, entry) {
    if(value.length > 0)
    {
        var parts = value.split(':', 2);
        return {val: parts[0], len: +parts[1]};
    }
    else
        return null;
}

function createWithTabsTemplate(list) {
    var R = `
<div class="row">
    <div class="col-lg-12">
        <div class="tab-header">
            <ma-view-actions override="::formController.actions" entry="entry" entity="::formController.entity">
                <ma-list-button ng-if="::entity.listView().enabled" entity="::entity"></ma-list-button>
            </ma-view-actions>
            <h1 compile="::formController.title">
                {{ 'CREATE_NEW' | translate }} {{ ::formController.view.entity.label() | humanize:true | singularize | translate }}
            </h1>
            <p class="lead" ng-if="::formController.description" compile="::formController.description">{{ ::formController.description }}</p>
        </div>
    </div>
</div>
<div class="row" id="create-view" ng-class="::'ng-admin-entity-' + formController.entity.name()">
    <form class="col-lg-12 form-horizontal" name="formController.form" ng-submit="formController.submitCreation($event)">
        <uib-tabset active="active">
    `;
    for(var i = 0; i < list.length; ++i)
    {
        R += '<uib-tab index="' +i+ '" heading="' +list[i].name+ '">'
            + '<div ng-repeat="field in ::formController.fields.slice(' +list[i].min+ ',' +list[i].max+ ' ) track by $index" compile="::field.getTemplateValueWithLabel(entry)">'
            + '<ma-field field="::field" value="entry.values[field.name()]" entry="entry" entity="::entity" form="formController.form" datastore="::formController.dataStore"></ma-field>'
            + '</div>'
            + '</uib-tab>';
    }
    R += `
        </uib-tabset>
        <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
                <ma-submit-button label="SUBMIT"></ma-submit-button>
            </div>
        </div>
    </form>
</div>
    `;
    return R;
}

function editWithTabsTemplate(list) {
    var R = `
<div class="row">
    <div class="col-lg-12">
        <div class="tab-header">
            <ma-view-actions override="::formController.actions" entry="entry" entity="::formController.entity">
                <ma-list-button ng-if="::entity.listView().enabled" entity="::entity"></ma-list-button>
                <ma-delete-button ng-if="::entity.deletionView().enabled" entry="entry" entity="::entity"></ma-delete-button>
            </ma-view-actions>
            <h1 compile="::formController.title">
                {{ 'EDIT' | translate }} {{ ::formController.entity.label() | humanize:true | singularize | translate }} #{{ ::entry.identifierValue }}
            </h1>
        </div>
    </div>
</div>
<div class="row" id="edit-view" ng-class="::'ng-admin-entity-' + formController.entity.name()">
    <form class="col-lg-12 form-horizontal" name="formController.form" ng-submit="formController.submitEdition($event)">
        <uib-tabset active="active">
    `;
    for(var i = 0; i < list.length; ++i)
    {
        R += '<uib-tab index="' +i+ '" heading="' +list[i].name+ '">'
            + '<div ng-repeat="field in ::formController.fields.slice(' +list[i].min+ ',' +list[i].max+ ' ) track by $index" compile="::field.getTemplateValueWithLabel(entry)">'
            + '<ma-field field="::field" value="entry.values[field.name()]" entry="entry" entity="::entity" form="formController.form" datastore="::formController.dataStore"></ma-field>'
            + '</div>'
            + '</uib-tab>';
    }
    R += `
        </uib-tabset>
        <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
                <ma-submit-button label="SAVE_CHANGES"></ma-submit-button>
            </div>
        </div>
    </form>
</div>
    `;
    return R;
}

// http://stackoverflow.com/questions/35895411/ng-admin-and-google-maps
myApp.directive('map', [function () {
return {
    restrict: 'E',
    scope: {
        value: '=location',
    },
    link: function($scope, uiGmapIsReady) {
        if ($scope.value == undefined) {
            $scope.value = { lat: 48.88, lon: 14.12};
        }
        $scope.map = { center: { latitude: $scope.value.lat, longitude: $scope.value.lon }, zoom: 4 };
        $scope.marker = {
            id: 0,
            coords: {
                latitude: $scope.value.lat,
                longitude: $scope.value.lon
            },
            options: { draggable: true },
            events: {
                dragend: function (marker, eventName, args) {
                    $scope.value = { lat: marker.getPosition().lat(), lon: marker.getPosition().lng() };
                }
            }
        };
    },
    template:
    `
    <div class="row list-view">
        <div class="col-lg-12">
            <ui-gmap-google-map center="map.center" zoom="map.zoom" draggable="true" options="options" pan=true refresh="true">
                <ui-gmap-marker coords="marker.coords" options="marker.options" events="marker.events" idkey="marker.id"/>
            </ui-gmap-google-map>
        </div>
    </div>
    `
};}]);

myApp.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: GoogleMapsKey,
        v: '3',
        libraries: 'visualization'
    });
});

myApp.directive('rgraph', ['$http', '$interval', function($http, $interval) {
return {
    restrict: 'E',
    scope: {
        value: '=',
    },
    link: function($scope) {
            function updateData() {
                $http({method: 'GET', url: '/rgraph/'.concat($scope.value)})
                    .then(function(response) {
                        $scope.rxChartObject.data = response.data.array;
                        $scope.rxChartObject.options.vAxes[1] = response.data.band;
                    });
            }
            $scope.rxChartObject = {};
            $scope.rxChartObject.type = "LineChart";
            $scope.rxChartObject.options = {
                "vAxes": {
                    0: {"title": 'Data Rate / Power'},
                    1: {"title": 'Frequency (MHz)'}
                },
                "series": {
                    0: {"targetAxisIndex": 0},
                    1: {"targetAxisIndex": 0},
                    2: {"targetAxisIndex": 1}
                },
                "chartArea": {
                    "top": 0, "bottom": "10%",
                    "left": 0, "right": 0
                },
                "legend": {
                    "position": "none"
                },
                "pointSize": 3,
                "vAxis": {
                    "textPosition": "in",
                    "gridlines": {"count": -1}
                },
                "vAxes": {
                    0: {"minValue": 0, "maxValue": 11},
                    1: {"minValue": 433, "maxValue": 928}
                }
            };
            updateData();
            $scope.stopTime = $interval(updateData, 5000);
            $scope.$on('$destroy', function() {
                $interval.cancel($scope.stopTime);
            });
    },
    template: '<div google-chart chart="rxChartObject"></div>'
};}]);

myApp.directive('qgraph', ['$http', '$interval', function($http, $interval) {
return {
    restrict: 'E',
    scope: {
        value: '=',
    },
    link: function($scope) {
            function updateData() {
                $http({method: 'GET', url: '/qgraph/'.concat($scope.value)})
                    .then(function(response) {
                        $scope.rxqChartObject.data = response.data.array;
                    });
            }
            $scope.rxqChartObject = {};
            $scope.rxqChartObject.type = "LineChart";
            $scope.rxqChartObject.options = {
                "vAxes": {
                    0: {"title": 'RSSI (dBm)'},
                    1: {"title": 'SNR (dB)'}
                },
                "series": {
                    0: {"targetAxisIndex": 0, "pointsVisible": false},
                    1: {"targetAxisIndex": 0, "pointSize": 3},
                    2: {"targetAxisIndex": 1, "pointsVisible": false},
                    3: {"targetAxisIndex": 1, "pointSize": 3}
                },
                "chartArea": {
                    "top": 0, "bottom": "10%",
                    "left": 0, "right": 0
                },
                "legend": {
                    "position": "none"
                },
                "vAxis": {
                    "textPosition": "in",
                    "gridlines": {"count": -1}
                },
                "vAxes": {
                    0: {"maxValue": 0},
                    1: {"minValue": 0}
                }
            };
            updateData();
            $scope.stopTime = $interval(updateData, 5000);
            $scope.$on('$destroy', function() {
                $interval.cancel($scope.stopTime);
            });
    },
    template: '<div google-chart chart="rxqChartObject"></div>'
};}]);

myApp.directive('dgraph', ['$http', '$interval', function($http, $interval) {
return {
    restrict: 'E',
    scope: {
        value: '=',
    },
    link: function($scope) {
            function updateData() {
                $http({method: 'GET', url: '/devstat/'.concat($scope.value)})
                    .then(function(response) {
                        $scope.rxdChartObject.data = response.data.array;
                    });
            }
            $scope.rxdChartObject = {};
            $scope.rxdChartObject.type = "LineChart";
            $scope.rxdChartObject.options = {
                "vAxes": {
                    0: {"title": 'Battery'},
                    1: {"title": 'SNR (dB)'}
                },
                "series": {
                    0: {"targetAxisIndex": 0},
                    1: {"targetAxisIndex": 1}
                },
                "chartArea": {
                    "top": 0, "bottom": "10%",
                    "left": 0, "right": 0
                },
                "legend": {
                    "position": "none"
                },
                "pointSize": 3,
                "vAxis": {
                    "textPosition": "in",
                    "gridlines": {"count": -1}
                },
                "vAxes": {
                    0: {"minValue":0, "maxValue": 255},
                    1: {"minValue":-32, "maxValue": 31}
                }
            };
            updateData();
            $scope.stopTime = $interval(updateData, 5000);
            $scope.$on('$destroy', function() {
                $interval.cancel($scope.stopTime);
            });
    },
    template: '<div google-chart chart="rxdChartObject"></div>'
};}]);
