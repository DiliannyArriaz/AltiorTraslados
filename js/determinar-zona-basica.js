// Sistema básico de determinación de zonas sin dependencia de servicios externos
// Este sistema se basa únicamente en la extracción de códigos postales y una base de datos local

// Base de datos local de códigos postales y zonas
const BASE_DATOS_CP = {
    // CABA
    1000: 'CABA', 1001: 'CABA', 1002: 'CABA', 1003: 'CABA', 1004: 'CABA', 1005: 'CABA', 1006: 'CABA', 1007: 'CABA',
    1008: 'CABA', 1009: 'CABA', 1010: 'CABA', 1011: 'CABA', 1012: 'CABA', 1013: 'CABA', 1014: 'CABA', 1015: 'CABA',
    1016: 'CABA', 1017: 'CABA', 1018: 'CABA', 1019: 'CABA', 1020: 'CABA', 1021: 'CABA', 1022: 'CABA', 1023: 'CABA',
    1024: 'CABA', 1025: 'CABA', 1026: 'CABA', 1027: 'CABA', 1028: 'CABA', 1029: 'CABA', 1030: 'CABA', 1031: 'CABA',
    1032: 'CABA', 1033: 'CABA', 1034: 'CABA', 1035: 'CABA', 1036: 'CABA', 1037: 'CABA', 1038: 'CABA', 1039: 'CABA',
    1040: 'CABA', 1041: 'CABA', 1042: 'CABA', 1043: 'CABA', 1044: 'CABA', 1045: 'CABA', 1046: 'CABA', 1047: 'CABA',
    1048: 'CABA', 1049: 'CABA', 1050: 'CABA', 1051: 'CABA', 1052: 'CABA', 1053: 'CABA', 1054: 'CABA', 1055: 'CABA',
    1056: 'CABA', 1057: 'CABA', 1058: 'CABA', 1059: 'CABA', 1060: 'CABA', 1061: 'CABA', 1062: 'CABA', 1063: 'CABA',
    1064: 'CABA', 1065: 'CABA', 1066: 'CABA', 1067: 'CABA', 1068: 'CABA', 1069: 'CABA', 1070: 'CABA', 1071: 'CABA',
    1072: 'CABA', 1073: 'CABA', 1074: 'CABA', 1075: 'CABA', 1076: 'CABA', 1077: 'CABA', 1078: 'CABA', 1079: 'CABA',
    1080: 'CABA', 1081: 'CABA', 1082: 'CABA', 1083: 'CABA', 1084: 'CABA', 1085: 'CABA', 1086: 'CABA', 1087: 'CABA',
    1088: 'CABA', 1089: 'CABA', 1090: 'CABA', 1091: 'CABA', 1092: 'CABA', 1093: 'CABA', 1094: 'CABA', 1095: 'CABA',
    1096: 'CABA', 1097: 'CABA', 1098: 'CABA', 1099: 'CABA', 1100: 'CABA', 1101: 'CABA', 1102: 'CABA', 1103: 'CABA',
    1104: 'CABA', 1105: 'CABA', 1106: 'CABA', 1107: 'CABA', 1108: 'CABA', 1109: 'CABA', 1110: 'CABA', 1111: 'CABA',
    1112: 'CABA', 1113: 'CABA', 1114: 'CABA', 1115: 'CABA', 1116: 'CABA', 1117: 'CABA', 1118: 'CABA', 1119: 'CABA',
    1120: 'CABA', 1121: 'CABA', 1122: 'CABA', 1123: 'CABA', 1124: 'CABA', 1125: 'CABA', 1126: 'CABA', 1127: 'CABA',
    1128: 'CABA', 1129: 'CABA', 1130: 'CABA', 1131: 'CABA', 1132: 'CABA', 1133: 'CABA', 1134: 'CABA', 1135: 'CABA',
    1136: 'CABA', 1137: 'CABA', 1138: 'CABA', 1139: 'CABA', 1140: 'CABA', 1141: 'CABA', 1142: 'CABA', 1143: 'CABA',
    1144: 'CABA', 1145: 'CABA', 1146: 'CABA', 1147: 'CABA', 1148: 'CABA', 1149: 'CABA', 1150: 'CABA', 1151: 'CABA',
    1152: 'CABA', 1153: 'CABA', 1154: 'CABA', 1155: 'CABA', 1156: 'CABA', 1157: 'CABA', 1158: 'CABA', 1159: 'CABA',
    1160: 'CABA', 1161: 'CABA', 1162: 'CABA', 1163: 'CABA', 1164: 'CABA', 1165: 'CABA', 1166: 'CABA', 1167: 'CABA',
    1168: 'CABA', 1169: 'CABA', 1170: 'CABA', 1171: 'CABA', 1172: 'CABA', 1173: 'CABA', 1174: 'CABA', 1175: 'CABA',
    1176: 'CABA', 1177: 'CABA', 1178: 'CABA', 1179: 'CABA', 1180: 'CABA', 1181: 'CABA', 1182: 'CABA', 1183: 'CABA',
    1184: 'CABA', 1185: 'CABA', 1186: 'CABA', 1187: 'CABA', 1188: 'CABA', 1189: 'CABA', 1190: 'CABA', 1191: 'CABA',
    1192: 'CABA', 1193: 'CABA', 1194: 'CABA', 1195: 'CABA', 1196: 'CABA', 1197: 'CABA', 1198: 'CABA', 1199: 'CABA',
    1200: 'CABA', 1201: 'CABA', 1202: 'CABA', 1203: 'CABA', 1204: 'CABA', 1205: 'CABA', 1206: 'CABA', 1207: 'CABA',
    1208: 'CABA', 1209: 'CABA', 1210: 'CABA', 1211: 'CABA', 1212: 'CABA', 1213: 'CABA', 1214: 'CABA', 1215: 'CABA',
    1216: 'CABA', 1217: 'CABA', 1218: 'CABA', 1219: 'CABA', 1220: 'CABA', 1221: 'CABA', 1222: 'CABA', 1223: 'CABA',
    1224: 'CABA', 1225: 'CABA', 1226: 'CABA', 1227: 'CABA', 1228: 'CABA', 1229: 'CABA', 1230: 'CABA', 1231: 'CABA',
    1232: 'CABA', 1233: 'CABA', 1234: 'CABA', 1235: 'CABA', 1236: 'CABA', 1237: 'CABA', 1238: 'CABA', 1239: 'CABA',
    1240: 'CABA', 1241: 'CABA', 1242: 'CABA', 1243: 'CABA', 1244: 'CABA', 1245: 'CABA', 1246: 'CABA', 1247: 'CABA',
    1248: 'CABA', 1249: 'CABA', 1250: 'CABA', 1251: 'CABA', 1252: 'CABA', 1253: 'CABA', 1254: 'CABA', 1255: 'CABA',
    1256: 'CABA', 1257: 'CABA', 1258: 'CABA', 1259: 'CABA', 1260: 'CABA', 1261: 'CABA', 1262: 'CABA', 1263: 'CABA',
    1264: 'CABA', 1265: 'CABA', 1266: 'CABA', 1267: 'CABA', 1268: 'CABA', 1269: 'CABA', 1270: 'CABA', 1271: 'CABA',
    1272: 'CABA', 1273: 'CABA', 1274: 'CABA', 1275: 'CABA', 1276: 'CABA', 1277: 'CABA', 1278: 'CABA', 1279: 'CABA',
    1280: 'CABA', 1281: 'CABA', 1282: 'CABA', 1283: 'CABA', 1284: 'CABA', 1285: 'CABA', 1286: 'CABA', 1287: 'CABA',
    1288: 'CABA', 1289: 'CABA', 1290: 'CABA', 1291: 'CABA', 1292: 'CABA', 1293: 'CABA', 1294: 'CABA', 1295: 'CABA',
    1296: 'CABA', 1297: 'CABA', 1298: 'CABA', 1299: 'CABA', 1300: 'CABA', 1301: 'CABA', 1302: 'CABA', 1303: 'CABA',
    1304: 'CABA', 1305: 'CABA', 1306: 'CABA', 1307: 'CABA', 1308: 'CABA', 1309: 'CABA', 1310: 'CABA', 1311: 'CABA',
    1312: 'CABA', 1313: 'CABA', 1314: 'CABA', 1315: 'CABA', 1316: 'CABA', 1317: 'CABA', 1318: 'CABA', 1319: 'CABA',
    1320: 'CABA', 1321: 'CABA', 1322: 'CABA', 1323: 'CABA', 1324: 'CABA', 1325: 'CABA', 1326: 'CABA', 1327: 'CABA',
    1328: 'CABA', 1329: 'CABA', 1330: 'CABA', 1331: 'CABA', 1332: 'CABA', 1333: 'CABA', 1334: 'CABA', 1335: 'CABA',
    1336: 'CABA', 1337: 'CABA', 1338: 'CABA', 1339: 'CABA', 1340: 'CABA', 1341: 'CABA', 1342: 'CABA', 1343: 'CABA',
    1344: 'CABA', 1345: 'CABA', 1346: 'CABA', 1347: 'CABA', 1348: 'CABA', 1349: 'CABA', 1350: 'CABA', 1351: 'CABA',
    1352: 'CABA', 1353: 'CABA', 1354: 'CABA', 1355: 'CABA', 1356: 'CABA', 1357: 'CABA', 1358: 'CABA', 1359: 'CABA',
    1360: 'CABA', 1361: 'CABA', 1362: 'CABA', 1363: 'CABA', 1364: 'CABA', 1365: 'CABA', 1366: 'CABA', 1367: 'CABA',
    1368: 'CABA', 1369: 'CABA', 1370: 'CABA', 1371: 'CABA', 1372: 'CABA', 1373: 'CABA', 1374: 'CABA', 1375: 'CABA',
    1376: 'CABA', 1377: 'CABA', 1378: 'CABA', 1379: 'CABA', 1380: 'CABA', 1381: 'CABA', 1382: 'CABA', 1383: 'CABA',
    1384: 'CABA', 1385: 'CABA', 1386: 'CABA', 1387: 'CABA', 1388: 'CABA', 1389: 'CABA', 1390: 'CABA', 1391: 'CABA',
    1392: 'CABA', 1393: 'CABA', 1394: 'CABA', 1395: 'CABA', 1396: 'CABA', 1397: 'CABA', 1398: 'CABA', 1399: 'CABA',
    1400: 'CABA', 1401: 'CABA', 1402: 'CABA', 1403: 'CABA', 1404: 'CABA', 1405: 'CABA', 1406: 'CABA', 1407: 'CABA',
    1408: 'CABA', 1409: 'CABA', 1410: 'CABA', 1411: 'CABA', 1412: 'CABA', 1413: 'CABA', 1414: 'CABA', 1415: 'CABA',
    1416: 'CABA', 1417: 'CABA', 1418: 'CABA', 1419: 'CABA', 1420: 'CABA', 1421: 'CABA', 1422: 'CABA', 1423: 'CABA',
    1424: 'CABA', 1425: 'CABA', 1426: 'CABA', 1427: 'CABA', 1428: 'CABA', 1429: 'CABA', 1430: 'CABA', 1431: 'CABA',
    1432: 'CABA', 1433: 'CABA', 1434: 'CABA', 1435: 'CABA', 1436: 'CABA', 1437: 'CABA', 1438: 'CABA', 1439: 'CABA',
    1440: 'CABA', 1441: 'CABA', 1442: 'CABA', 1443: 'CABA', 1444: 'CABA', 1445: 'CABA', 1446: 'CABA', 1447: 'CABA',
    1448: 'CABA', 1449: 'CABA', 1450: 'CABA', 1451: 'CABA', 1452: 'CABA', 1453: 'CABA', 1454: 'CABA', 1455: 'CABA',
    1456: 'CABA', 1457: 'CABA', 1458: 'CABA', 1459: 'CABA', 1460: 'CABA', 1461: 'CABA', 1462: 'CABA', 1463: 'CABA',
    1464: 'CABA', 1465: 'CABA', 1466: 'CABA', 1467: 'CABA', 1468: 'CABA', 1469: 'CABA', 1470: 'CABA', 1471: 'CABA',
    1472: 'CABA', 1473: 'CABA', 1474: 'CABA', 1475: 'CABA', 1476: 'CABA', 1477: 'CABA', 1478: 'CABA', 1479: 'CABA',
    1480: 'CABA', 1481: 'CABA', 1482: 'CABA', 1483: 'CABA', 1484: 'CABA', 1485: 'CABA', 1486: 'CABA', 1487: 'CABA',
    1488: 'CABA', 1489: 'CABA', 1490: 'CABA', 1491: 'CABA', 1492: 'CABA', 1493: 'CABA', 1494: 'CABA', 1495: 'CABA',
    1496: 'CABA', 1497: 'CABA', 1498: 'CABA', 1499: 'CABA',
    
    // ZONA SUR
    1870: 'Avellaneda / Lanús', 1871: 'Avellaneda / Lanús', 1872: 'Avellaneda / Lanús', 
    1873: 'Avellaneda / Lanús', 1874: 'Avellaneda / Lanús', 1875: 'Wilde / Monte Chingolo',
    1878: 'Quilmes / Alte Brown', 1879: 'Quilmes / Alte Brown', 1846: 'Quilmes / Alte Brown',
    1880: 'Berazategui / Hudson', 1884: 'Berazategui / Hudson', 1885: 'Berazategui / Hudson', 
    1886: 'Berazategui / Hudson', 1832: 'Lomas de Zamora', 1804: 'Canning / Spegazzini', 
    1812: 'Canning / Spegazzini', 1900: 'La Plata',
    
    // ZONA OESTE
    1704: 'Ramos Mejía / Ciudadela', 1702: 'Ramos Mejía / Ciudadela',
    1708: 'Morón / Haedo', 1706: 'Morón / Haedo',
    1678: 'Caseros / El Palomar', 1684: 'Caseros / El Palomar',
    1686: 'Hurlingham / Loma Hermosa', 1657: 'Hurlingham / Loma Hermosa',
    1714: 'Ituzaingó / Padua', 1718: 'Ituzaingó / Padua',
    1663: 'San Miguel / José C. Paz', 1665: 'San Miguel / José C. Paz',
    1722: 'Merlo / Paso del Rey', 1742: 'Merlo / Paso del Rey',
    1744: 'Moreno / Francisco Álvarez', 1746: 'Moreno / Francisco Álvarez',
    1748: 'Gral. Rodríguez', 6700: 'Luján',
    
    // ZONA NORTE
    1636: 'Vicente López / Olivos', 1638: 'Vicente López / Olivos', 1602: 'Vicente López / Olivos',
    1650: 'San Martín / San Andrés', 1651: 'San Martín / San Andrés',
    1642: 'San Isidro / Boulogne', 1609: 'San Isidro / Boulogne', 1640: 'San Isidro / Boulogne', 
    1641: 'San Isidro / Boulogne', 1643: 'San Isidro / Boulogne', 1644: 'San Isidro / Boulogne', 
    1646: 'San Isidro / Boulogne',
    1653: 'Villa Ballester / José León Suárez', 1655: 'Villa Ballester / José León Suárez',
    1648: 'Tigre Centro / Pacheco', 1617: 'Tigre Centro / Pacheco', 1618: 'Tigre Centro / Pacheco',
    1611: 'Don Torcuato / Grand Bourg', 1615: 'Don Torcuato / Grand Bourg',
    1621: 'Benavídez / Milberg / Tortuguitas', 1619: 'Benavídez / Milberg / Tortuguitas', 
    1667: 'Benavídez / Milberg / Tortuguitas',
    1623: 'Ing. Maschwitz / Del Viso', 1669: 'Ing. Maschwitz / Del Viso',
    1629: 'Pilar / Escobar', 1625: 'Pilar / Escobar', 1630: 'Pilar / Escobar',
    2804: 'Campana / Cardales', 2814: 'Campana / Cardales'
};

// Función para extraer código postal de una dirección
function extraerCodigoPostal(direccion) {
    // Patrón para manejar códigos postales como "C1426", "C 1426" y "C1426AGX"
    const cpRegex = /\b(?:C\s*)?(\d{4})(?:[a-zA-Z]*)?\b/gi;
    let match;
    
    while ((match = cpRegex.exec(direccion)) !== null) {
        const cp = parseInt(match[1]);
        if (cp >= 1000 && cp <= 9999) {
            return cp;
        }
    }
    
    return null;
}

// Función para determinar zona por código postal usando la base de datos local
function determinarZonaPorCPBasica(cp) {
    if (!cp) return null;
    
    // Verificar en la base de datos local
    if (BASE_DATOS_CP[cp]) {
        return BASE_DATOS_CP[cp];
    }
    
    // Si no se encuentra, verificar rangos
    if (cp >= 1000 && cp <= 1499) {
        return 'CABA';
    }
    
    return null;
}

// Función para determinar zona por texto (lugares comunes)
function determinarZonaPorTextoBasica(direccion) {
    const dir = direccion.toLowerCase();
    
    // Verificar si la dirección está vacía o es muy corta
    if (!dir || dir.length < 4) {
        return null;
    }

    // EZEIZA - Verificación más robusta
    if (dir.includes('ezeiza') || dir.includes('pistarini') || 
        (dir.includes('aeropuerto') && (dir.includes('internacional') || dir.includes('ezeiza'))) ||
        dir.includes('ministro pistarini')) {
        return 'EZEIZA';
    }

    // AEROPARQUE - Verificación más robusta
    if (dir.includes('aeroparque') || (dir.includes('aeropuerto') && dir.includes('aeroparque')) ||
        (dir.includes('jorge newbery')) || dir.includes('newbery')) {
        return 'AEROPARQUE';
    }

    // CABA
    if (dir.includes('caba') || dir.includes('ciudad autónoma') || dir.includes('ciudad autonoma') ||
        dir.includes('capital federal') ||
        dir.includes('palermo') ||
        dir.includes('recoleta') || dir.includes('san telmo') ||
        dir.includes('la boca') || dir.includes('microcentro') ||
        dir.includes('puerto madero') || dir.includes('centro cívico') ||
        dir.includes('colegiales') || dir.includes('belgrano') ||
        dir.includes('nuñez') || dir.includes('saavedra') ||
        dir.includes('villa urquiza') || dir.includes('villa crespo') ||
        dir.includes('almagro') || dir.includes('caballito') ||
        // Verificar si contiene "buenos aires" pero no es un aeropuerto
        (dir.includes('buenos aires') && !dir.includes('ezeiza') && !dir.includes('aeroparque'))) {
        return 'CABA';
    }

    // ZONA SUR
    if (dir.includes('avellaneda') || dir.includes('lanús') || dir.includes('lanus')) return 'Avellaneda / Lanús';
    if (dir.includes('wilde') || dir.includes('monte chingolo')) return 'Wilde / Monte Chingolo';
    if (dir.includes('quilmes') || dir.includes('almirante brown') || dir.includes('alte brown')) return 'Quilmes / Alte Brown';
    if (dir.includes('berazategui') || dir.includes('hudson')) return 'Berazategui / Hudson';
    if (dir.includes('lomas de zamora')) return 'Lomas de Zamora';
    if (dir.includes('canning') || dir.includes('spegazzini')) return 'Canning / Spegazzini';
    if (dir.includes('la plata')) return 'La Plata';

    // ZONA OESTE
    if (dir.includes('ramos mejía') || dir.includes('ramos mejia') || dir.includes('ciudadela')) return 'Ramos Mejía / Ciudadela';
    if (dir.includes('morón') || dir.includes('moron') || dir.includes('haedo')) return 'Morón / Haedo';
    if (dir.includes('caseros') || dir.includes('el palomar')) return 'Caseros / El Palomar';
    if (dir.includes('hurlingham') || dir.includes('loma hermosa')) return 'Hurlingham / Loma Hermosa';
    if (dir.includes('ituzaingó') || dir.includes('ituzaingo') || dir.includes('padua')) return 'Ituzaingó / Padua';
    if (dir.includes('san miguel') || dir.includes('jose c. paz') || dir.includes('josé c. paz')) return 'San Miguel / José C. Paz';
    if (dir.includes('merlo') || dir.includes('paso del rey')) return 'Merlo / Paso del Rey';
    if (dir.includes('moreno') || dir.includes('francisco álvarez') || dir.includes('francisco alvarez')) return 'Moreno / Francisco Álvarez';
    if (dir.includes('general rodríguez') || dir.includes('gral. rodríguez') || dir.includes('general rodriguez')) return 'Gral. Rodríguez';
    if (dir.includes('luján') || dir.includes('lujan')) return 'Luján';

    // ZONA NORTE
    if (dir.includes('vicente lópez') || dir.includes('vicente lopez') || dir.includes('olivos')) return 'Vicente López / Olivos';
    if (dir.includes('san martín') || dir.includes('san martin') || dir.includes('san andrés') || dir.includes('san andres')) return 'San Martín / San Andrés';
    if (dir.includes('san isidro') || dir.includes('boulogne')) return 'San Isidro / Boulogne';
    if (dir.includes('villa ballester') || dir.includes('josé león suárez') || dir.includes('jose leon suarez') || dir.includes('lafayette')) return 'Villa Ballester / José León Suárez';
    if (dir.includes('tigre') || dir.includes('pacheco')) return 'Tigre Centro / Pacheco';
    if (dir.includes('don torcuato') || dir.includes('grand bourg')) return 'Don Torcuato / Grand Bourg';
    if (dir.includes('benavídez') || dir.includes('benavidez') || dir.includes('milberg') || dir.includes('tortuguitas')) return 'Benavídez / Milberg / Tortuguitas';
    if (dir.includes('ingeniero maschwitz') || dir.includes('ing. maschwitz') || dir.includes('del viso')) return 'Ing. Maschwitz / Del Viso';
    if (dir.includes('pilar') || dir.includes('escobar')) return 'Pilar / Escobar';
    if (dir.includes('campana') || dir.includes('cardales')) return 'Campana / Cardales';

    return null;
}

// Función principal para determinar zona (versión básica sin servicios externos)
function determinarZonaBasica(direccion) {
    // 1. Verificaciones iniciales para aeropuertos (casos especiales)
    const dirLower = direccion.toLowerCase();
    
    // Verificación rápida de aeropuertos por nombre
    if (dirLower.includes('ezeiza') || dirLower.includes('pistarini') || 
        (dirLower.includes('aeropuerto') && (dirLower.includes('internacional') || dirLower.includes('ezeiza'))) ||
        dirLower.includes('ministro pistarini')) {
        return 'EZEIZA';
    }
    
    if (dirLower.includes('aeroparque') || (dirLower.includes('aeropuerto') && dirLower.includes('aeroparque')) ||
        (dirLower.includes('jorge newbery')) || dirLower.includes('newbery')) {
        return 'AEROPARQUE';
    }

    // 2. Intentar extraer CP directamente del texto (método principal y más rápido)
    const cp = extraerCodigoPostal(direccion);
    if (cp) {
        const zonaCP = determinarZonaPorCPBasica(cp);
        if (zonaCP) {
            console.log(`Zona determinada por CP básico (${cp}): ${zonaCP}`);
            return zonaCP;
        }
    }

    // 3. Intentar con coincidencias de texto (método secundario)
    const zonaTexto = determinarZonaPorTextoBasica(direccion);
    if (zonaTexto) {
        return zonaTexto;
    }

    // 4. Si no se encuentra ninguna coincidencia, retornar null
    console.log('No se pudo determinar la zona con los métodos básicos');
    return null;
}

// Exportar funciones para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        determinarZonaBasica,
        determinarZonaPorCPBasica,
        determinarZonaPorTextoBasica,
        extraerCodigoPostal,
        BASE_DATOS_CP
    };
}