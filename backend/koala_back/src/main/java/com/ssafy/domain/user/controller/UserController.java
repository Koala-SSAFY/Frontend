package com.ssafy.domain.user.controller;

import com.ssafy.domain.user.model.dto.request.SignInDto;
import com.ssafy.domain.user.model.dto.request.UserAddRequest;
import com.ssafy.domain.user.service.UserService;
import com.ssafy.domain.user.service.UserServiceImpl;
import com.ssafy.global.auth.jwt.dto.JwtToken;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    // 회원가입 성공하면 {
    //	"message": "회원가입 성공!"
    //} 반환

    @PostMapping
    public ResponseEntity<?> signUp(@RequestBody JSONObject jsonObject) {
        UserAddRequest userAddRequest = new UserAddRequest(jsonObject);
        userService.signUp(userAddRequest);
        return ResponseEntity.ok().body("회원가입 성공!");
    }

    @PostMapping("/login")
    public JwtToken signIn(@RequestBody SignInDto signInDto){
        String loginId = signInDto.getLoginId();
        String password = signInDto.getPassword();
        JwtToken jwtToken = userService.signIn(loginId, password);
        log.info("request loginId: {}, password: {}", loginId, password);
        log.info("jwtToken accessToken: {}, refreshToken: {}", jwtToken.getAccessToken(), jwtToken.getRefreshToken());
        return jwtToken;
    }

    @PostMapping ("/test")
    public String test(){
        return "success";
    }

}
