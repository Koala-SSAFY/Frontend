package com.ssafy.domain.user.controller;

import com.ssafy.domain.user.model.dto.request.SignInDto;
import com.ssafy.domain.user.model.dto.request.SignUpDto;
import com.ssafy.domain.user.model.dto.request.UserDto;
import com.ssafy.domain.user.service.UserService;
import com.ssafy.global.auth.jwt.dto.JwtToken;
import com.ssafy.global.error.exception.TokenException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public ResponseEntity<?> signUp(@RequestBody SignUpDto signUpDto) {
//    public ResponseEntity<?> signUp(@RequestBody JSONObject jsonObject) {
//        SignUpDto signUpDto = new SignUpDto(jsonObject);
        UserDto savedUserDto = userService.signUp(signUpDto); // 이걸 반환해도 됨
        System.out.println(savedUserDto.getNickname());
//        return ResponseEntity.ok().body(savedUserDto);
        return ResponseEntity.ok().body(savedUserDto);
    }

    @PostMapping("/login")
    public JwtToken signIn(@RequestBody SignInDto signInDto) {
        String loginId = signInDto.getLoginId();
        String password = signInDto.getPassword();
        JwtToken jwtToken = userService.signIn(loginId, password);
        log.info("request loginId: {}, password: {}", loginId, password);
        log.info("jwtToken accessToken: {}, refreshToken: {}", jwtToken.getAccessToken(), jwtToken.getRefreshToken());
        return jwtToken;
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody String refreshToken) {
        JwtToken newToken = userService.generateNewAccessToken(refreshToken);
        return ResponseEntity.ok(newToken);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody String accessToken) {
//        userService.logout(accessToken);
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().body("logout successful");
    }

    @GetMapping("/check/check-id/{loginId}")
    public ResponseEntity<?> checkLoginId(@PathVariable String loginId) {
        boolean isExist = userService.checkLoginId(loginId);
        String message = isExist ? "이미 사용 중인 아이디입니다." : "사용 가능한 아이디입니다.";
        return ResponseEntity.ok().body(new JSONObject().put("available", !isExist).put("message", message).toString());
    }

    @GetMapping("/check/check-name/{nickname}")
    public ResponseEntity<?> checkNickname(@PathVariable String nickname) {
        boolean isExist = userService.checkNickname(nickname);
        String message = isExist ? "이미 사용 중인 닉네임입니다." : "사용 가능한 닉네임입니다.";
        return ResponseEntity.ok().body(new JSONObject().put("available", !isExist).put("message", message).toString());
    }

}
