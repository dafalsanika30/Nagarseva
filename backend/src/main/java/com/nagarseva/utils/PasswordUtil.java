package com.nagarseva.utils;

import java.util.UUID;

public class PasswordUtil {

    public static String generatePassword() {

        return UUID.randomUUID()
                .toString()
                .substring(0, 8);

    }

}