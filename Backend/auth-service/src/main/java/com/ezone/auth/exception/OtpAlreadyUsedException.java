package com.ezone.auth.exception;

public class OtpAlreadyUsedException extends RuntimeException {
    public OtpAlreadyUsedException(String message) {
        super(message);
    }
}
