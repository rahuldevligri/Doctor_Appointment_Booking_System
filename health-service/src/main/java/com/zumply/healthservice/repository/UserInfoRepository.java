package com.zumply.healthservice.repository;

import com.zumply.healthservice.entity.User;
import com.zumply.healthservice.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Integer> {
    Optional<UserInfo> findByUser(User user);
}
