package llustmarket.artmarket.web.mapper.board;

import llustmarket.artmarket.web.dto.board.AuthorDTO;
import llustmarket.artmarket.web.dto.board.BoardDTO;
import llustmarket.artmarket.web.dto.board.ProductDetailDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;


@Mapper
public interface BoardMapper {
    List<BoardDTO> getCategoryList(String category);

    List<Map<String, Object>> getCategoryFile(@Param("category") String category, @Param("productId") Long productId);

    List<Map<String, Object>> getArrayFile(Long productId);

    List<BoardDTO> getPopular();

    List<BoardDTO> getCurrent();

    List<BoardDTO> getSearch(String categoryKeyword);

    AuthorDTO getAuthor(Long productId);

    ProductDetailDTO getProductDetail(Long productId);

    List<Map<String, Object>> getProductFile(Long productId);

}
