package llustmarket.artmarket.web.dto.product;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Data
@NoArgsConstructor
public class ProductUpdateDTO {

    @NotNull
    private String articleModProductId;

    @NotNull
    private String articleModCategory;

    @NotBlank
    @Size(max = 30, message = "상품 제목은 최대 30자까지 입력 가능합니다.")
    private String articleModTitle;

    @NotBlank
    @Size(max = 1000, message = "상품 제목은 최대 1000자까지 입력 가능합니다.")
    private String articleModDetail;

    @NotNull(message = "파일은 필수 항목입니다.")
    private List<MultipartFile> articleModImgs;
}
