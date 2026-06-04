// exception/ResourceNotFoundException.java
package com.nagarseva.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}