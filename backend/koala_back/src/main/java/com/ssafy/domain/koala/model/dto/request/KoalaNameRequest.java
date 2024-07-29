package com.ssafy.domain.koala.model.dto.request;

import com.ssafy.domain.koala.model.entity.Koala;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class KoalaNameRequest {

	private String koalaName;

	public Koala toEntity(Koala koala, String koalaName) {
		return Koala.builder()
			.user(koala.getUser())
			.koalaName(koalaName)
			.koalaLevel(koala.getKoalaLevel())
			.koalaExp(koala.getKoalaExp())
			.koalaType(koala.getKoalaType())
			.build();
	}

}
