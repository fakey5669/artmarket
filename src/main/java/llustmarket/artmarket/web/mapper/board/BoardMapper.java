package llustmarket.artmarket.web.mapper.board;

import llustmarket.artmarket.web.dto.board.BoardDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;


@Mapper
public interface BoardMapper {
    List<BoardDTO> getCharacter();
}
