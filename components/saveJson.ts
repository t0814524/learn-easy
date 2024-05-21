import React, { useEffect, useState } from 'react';
import { View, Text, Button, AppState, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from './Layout';


export const saveConfigAsyncStorage = async (config: AppConfig) => {
    try {
        const jsonValue = JSON.stringify(config);
        // await AsyncStorage.removeItem('config');
        await AsyncStorage.setItem('config', jsonValue);
    } catch (e) {
        console.error("cant sace Config:")
        console.error(e)
    }
};

export const getConfigAsyncStorage = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('config');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error("error reading config");
        console.error(e);
    }
};
// let asdf = { "test": "asdf1" }
// saveConfigAsyncStorage("")