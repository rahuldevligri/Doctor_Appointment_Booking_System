package com.zumply.healthservice.service;

import com.zumply.healthservice.entity.User;
import com.zumply.healthservice.entity.UserInfo;
import com.zumply.healthservice.errorhandler.ZumplyErrorCode;
import com.zumply.healthservice.errorhandler.ZumplyException;
import com.zumply.healthservice.repository.UserInfoRepository;
import com.zumply.healthservice.repository.UserRepository;
import com.zumply.healthservice.request.AuthenticationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserInfoRepository userInfoRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public void saveUser(@RequestBody AuthenticationRequest data) {
        User user = new User();
        user.setUsername(data.getUsername());
        user.setPassword(this.passwordEncoder.encode(data.getPassword()));
        user.setCategory("user");
        userRepository.save(user);
        UserInfo userInfo = new UserInfo();
        userInfo.setUser(user);
        userInfo.setFirstName(data.getFirstName());
        userInfo.setMiddleName(data.getMiddleName());
        userInfo.setLastName(data.getLastName());
        userInfo.setAddress(data.getAddress());
        userInfo.setGender(data.getGender());
        userInfo.setMobile(data.getMobile());
        userInfo.setEmail(data.getEmail());
        userInfoRepository.save(userInfo);
    }

    public Optional<UserInfo> getUserInfoByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return userInfoRepository.findByUser(user);
        } else {
            throw new RuntimeException("User not found with username: " + username);
        }
    }
}


